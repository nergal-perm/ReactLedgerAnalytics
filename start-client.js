var args = [ 'start' ];
var opts = { stdio: 'inherit', cwd: 'client', shell: true };
require('cross-spawn').spawn('npm', args, opts);
