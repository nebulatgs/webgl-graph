// This lexes, parses, and interpretes js code blazingly fast

function execute(src) {
  return eval(src);
}

module.exports = execute;
