const webpack = require('webpack');
const config = require('./config/webpack/config.js');
const compiler = webpack(config);
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const git = require('git-rev');
const parseArgs = require('minimist')(process.argv);
const rimraf = require('rimraf');
const async = require('async');
const moment = require('moment');

async.waterfall([
        (cb) => {
            rimraf('./dist', () => {
                console.log('Removed dist folder.');
                cb();
            })
        },
        (cb) => {
            git.short(function (str) {
                console.log('Commit hash is', str);
                cb(null, str)
            });
        },
        (commitHash, cb) => {
            git.branch(function (str) {
                console.log('Branch name is', str);
                cb(null, str , commitHash)
            });
        },
        compile
    ], () => { console.log('queue is empty!'); }
);

function compile(branchName , commit, cb) {
    if(parseArgs.watch) {
        compiler.watch({
            aggregateTimeout: 300,
            poll: true
        }, (err, stats) => {
            console.info('update:', stats.hash);
        });
    } else {
        console.info('building...');
        compiler.run((err, stats)  => {
            if (!fs.existsSync(path.join(__dirname, '/builds/'))){
                fs.mkdirSync(path.join(__dirname, '/builds/'));
            }

            const output = fs.createWriteStream(path.join(__dirname, '/builds/', `/${branchName}_${commit}_${moment().format('DD-MM-YY_hh-mm:ss')}.zip`) );
            const archive = archiver('zip', { zlib: {level: 9 }});
            archive.pipe(output);
            archive.directory('./dist', false);
            archive.finalize();

            console.info('done.');
            cb(null);
        });
    }
}