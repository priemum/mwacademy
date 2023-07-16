var video = document.querySelector('video');

var config = [{initDataTypes: ['webm'],
  videoCapabilities: [{contentType: 'video/webm; codecs="vp9"'}]}];

if (!video.mediaKeys) {
  navigator.requestMediaKeySystemAccess('org.w3.clearkey',
      config).then(
    function(keySystemAccess) {
      var promise = keySystemAccess.createMediaKeys();
      promise.catch(
        console.error.bind(console, 'Unable to create MediaKeys')
      );
      promise.then(
        function(createdMediaKeys) {
          return video.setMediaKeys(createdMediaKeys);
        }
      ).catch(
        console.error.bind(console, 'Unable to set MediaKeys')
      );
      promise.then(
        function(createdMediaKeys) {
          var initData = new Uint8Array([ 0xeb, 0xdd, 0x62, 0xf1, 0x68, 0x14, 0xd2, 0x7b,
               0x68, 0xef, 0x12, 0x2a, 0xfc, 0xe4, 0xae, 0x3c ]);
          var keySession = createdMediaKeys.createSession();
          keySession.addEventListener('message', handleMessage,
              false);
          return keySession.generateRequest('webm', initData);
        }
      ).catch(
        console.error.bind(console,
          'Unable to create or initialize key session')
      );
    }
  );
}

function handleMessage(event) {
  var keySession = event.target;
  var license = new Uint8Array([ 0xeb, 0xdd, 0x62, 0xf1, 0x68, 0x14, 0xd2, 0x7b,
     0x68, 0xef, 0x12, 0x2a, 0xfc, 0xe4, 0xae, 0x3c ]);
  keySession.update(license).catch(
    console.error.bind(console, 'update() failed')
  );
}

var sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');

reader.onload = function (e) {
     sourceBuffer.appendBuffer(new Uint8Array(e.target.result));
     if (i === NUM_CHUNKS - 1) {
       mediaSource.endOfStream();
     } else {
       if (video.paused) {
         // start playing after first chunk is appended
         video.play();
       }
       readChunk_(++i);
     }
   };