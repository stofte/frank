/* eslint no-bitwise: 0 */
// modified from https://github.com/typicode/pegasus

function ajax(url, json = {}, method = 'POST') {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('content-type', 'application/json');
    let cbs = [];
    // onSuccess handler
    // onError   handler
    xhr.onreadystatechange = xhr.then = function(onSuccess, onError) {
    // Test if onSuccess is a function
    if (onSuccess && onSuccess.call) {
        cbs[1] = onSuccess;
        cbs[2] = onError;
    }

    // Test if request is complete
    if (xhr.readyState === 4) {

        // index will be:
        // 0 if undefined
        // 1 if status is between 200 and 399
        // 2 if status is over
        let cb = cbs[0 | xhr.status / 200];

        if (cb) {
            try {
                cb(JSON.parse(xhr.responseText), xhr);
            } catch (e) {
                cb(null, xhr);
            }
        }
    }
  };

  // Send
  xhr.send(JSON.stringify(json));

  // Return request
  return xhr;
}

export default ajax;
