navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

navigator.getUserMedia(
    {audio : true},
    function(stream){
      document.querySelector('audio').src = URL.createObjectURL(stream);
      var audioContext = new AudioContext();
      var analyser = audioContext.createAnalyser();
      var timeDomain = new Float32Array(analyser.frequencyBinCount);
      var frequency = new Uint8Array(analyser.frequencyBinCount);
      //var delay = audioContext.createDelay();
      //var delay = new delayProcess(audioContext);

      audioContext.createMediaStreamSource(stream).connect(analyser);

      (function animation(){
        analyser.getFloatTimeDomainData(timeDomain);
        analyser.getByteFrequencyData(frequency);

        context.clearRect(0, 0, canvas.width, canvas.height);

        // Frequency
        if(document.chbox.elements[0].checked){
          context.strokeStyle = 'blue';
          context.beginPath();
          context.moveTo(0, canvas.height - frequency[0]*canvas.height/255);
          for(var i=0; i<frequency.length; i++){
            context.lineTo(
                i*canvas.width/frequency.length,
                canvas.height - Math.max(0, frequency[i]*canvas.height/255)
                );
          }
          context.stroke();
        }

        // Time
        if(document.chbox.elements[1].checked){
          context.strokeStyle = 'red';
          context.beginPath();
          context.moveTo(0, canvas.height/2 + timeDomain[0]*canvas.height/2);
          for(var i=0; i<timeDomain.length; i++){
            context.lineTo(
                i*canvas.width/timeDomain.length,
                canvas.height/2 + timeDomain[i]*canvas.height/2
                );
          }
          context.stroke();
        }

        // Frequency + Timedomain (test1)
        if(document.chbox.elements[2].checked){
          freq_limit = 980;
          context.strokeStyle = 'green';
          context.beginPath();
          context.moveTo(canvas.width/2, canvas.height/2);
          for(var i=0; i<frequency.length - freq_limit + 1; i++){
            context.lineTo(
                canvas.width/2  + Math.sin(i/(frequency.length - freq_limit)*2*Math.PI) * (500 * timeDomain[i] + frequency[i]),
                canvas.height/2 + Math.cos(i/(frequency.length - freq_limit)*2*Math.PI) * (500 * timeDomain[i] + frequency[i])
                );
          }
          context.stroke();
        }

        // Frequency + Timedomain (test2)
        if(document.chbox.elements[3].checked){
          freq_limit = 900;
          context.strokeStyle = 'orange';
          context.beginPath();
          context.moveTo(canvas.width/2, canvas.height/2 + 100);
          for(var i=0; i<frequency.length - freq_limit + 1; i++){
            context.lineTo(
                canvas.width/2  + Math.sin(i/(frequency.length - freq_limit)*2*Math.PI) * (100 + 20 * timeDomain[i] + frequency[i]/10),
                canvas.height/2 + Math.cos(i/(frequency.length - freq_limit)*2*Math.PI) * (100 + 20 * timeDomain[i] + frequency[i]/10)
                );
          }
          context.stroke();
        }

        // Frequency + Timedomain (test3)
        if(document.chbox.elements[4].checked){
          freq_limit = 950;
          context.strokeStyle = 'white';
          context.beginPath();
          context.moveTo(canvas.width/2, canvas.height/2 + 100 + 20 * timeDomain[frequency.length - freq_limit] + frequency[frequency.length - freq_limit]/10);
          for(var i=0; i<frequency.length - freq_limit + 1; i++){
            context.lineTo(
                canvas.width/2  + Math.sin(i/(frequency.length - freq_limit)*2*Math.PI) * (100 + 20 * timeDomain[i] + frequency[i]/10),
                canvas.height/2 + Math.cos(i/(frequency.length - freq_limit)*2*Math.PI) * (100 + 20 * timeDomain[i] + frequency[i]/10)
                );
          }
          context.stroke();
        }
        requestAnimationFrame(animation);
      })();
    },
    console.log
    );


