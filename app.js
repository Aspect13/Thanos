import html2canvas from 'html2canvas';
import './index.sass';


let original_query = '#puzzle';
const fake_cls = 'thanos';


const processCanvas = canvas => {

    const layers_number = 40; //overall number of layers
    const density = 2; //number of duplicating pixels
    const block_size = 4; //size of canvas block: r,g,b,a

    const {width, height} = canvas;
    const cntxt = canvas.getContext('2d');
    const img_data = cntxt.getImageData(0, 0, width, height);
    // const empty_img_data = cntxt.createImageData(width, height);
   
    const getRandomLayer = (dependency, strength=2) => {
        let ran = (Math.random() + strength*dependency) / (strength + 1);
        return Math.floor(layers_number * ran);
    };

    const insertPixels = (layer, pixel_position) => {
        for (let j = 0; j < block_size; j++) {
            layer.data[pixel_position + j] = img_data.data[pixel_position + j]
            // if (img_data.data[pixel_position + j] !== 0 && img_data.data[pixel_position + j] !== 255) {
            //     console.log('HERE', img_data.data[pixel_position + j])
            // }
        }
    }
    const getEmptyLayers = () => {
        const layers = [];
        for (let i = 0; i < layers_number; i++) {
            layers.push(cntxt.createImageData(width, height))
        }
        return layers;
    }

    // const layers = getEmptyLayers();
    const layers = [];
        for (let i = 0; i < layers_number; i++) {
            layers.push(cntxt.createImageData(width, height))
        }
  
    // console.log('empt layers', canvas)
    


    for (let w = 0; w < width; w++) {
        for (let h = 0; h < height; h++) {
            for (let d = 0; d < density; d++) {
                let random_layer = getRandomLayer(w/width);
                insertPixels(layers[random_layer], (w + width * h) * block_size)
            }
        }
    }

    
    return layers;
}

const cloneCanvas = elem => 
    elem.id !== 'doomsday' && 
        elem.style.visibility !== 'hidden' && 
            html2canvas(elem, {
                logging: false, 
                // letterRendering: 1, 
                allowTaint: false, 
                useCORS: true,
            }).then(canvas => {
                // console.log('query: ', original_query, elem)
                const transition_time = 5;
                const layers = processCanvas(canvas);

                // console.log('layers', layers)

                elem.style.transition = `all ${transition_time/10}s ease-out`;

                layers.forEach((item, index) => {
                    let new_elem = canvas.cloneNode();
                    new_elem.getContext('2d').putImageData(item, 0, 0);

                    new_elem.style.transition = `all ${transition_time}s ease-out ${1.5*index/layers.length}s`;
                    new_elem.className = fake_cls;

                    // console.log('rect', elem.offsetTop, item)
                    new_elem.style.top = elem.offsetTop + 'px';
                    new_elem.style.left = elem.offsetLeft + 'px';

                    elem.style.visibility = 'hidden';
                    document.body.appendChild(new_elem);
                })
});





const restotreAll = () => {
    Array.from(document.getElementsByClassName(fake_cls)).forEach(item => item.remove());
    Array.from(document.querySelectorAll(original_query)).forEach(item => item.style.visibility = 'visible');
};

const restore = item => item.remove();


const desintegrate = (item) => {
    const getAngles = (some_const = 60) => {
        let angle = (Math.random() - 0.5) * 2 * Math.PI;
        return [some_const*Math.sin(angle), some_const*Math.cos(angle)]
    }

    const getRotate = (some_const = 15) => (
        some_const * (Math.random() - 0.5)
    )

    const getTheJobDone = item => {
        let [sin, cos] = getAngles();
        let rotate_angle = getRotate(10);
        item.style.transform = `rotate(${rotate_angle}deg) translate(${cos}px, ${sin}px)`;
        item.style.opacity = 0;
        
        setTimeout(restore.bind(null, item), 5000)
    }

    // console.log('Desintegrating: ', item)
    // console.log('Desintegrating: ', document.getElementsByClassName(fake_cls))

    if (item === undefined) {
        let the_list = [];
        let tmp = setInterval(() => {
            
            the_list = document.getElementsByClassName(fake_cls);
            console.log('Desintegration attempt: ', document.getElementsByClassName(fake_cls))
            if (the_list.length) {
                // console.log('HERE', Array.from(the_list))
                clearInterval(tmp);
                Array.from(the_list).forEach(i => {
                    // console.log('Desintegrating: ', i)
                    getTheJobDone(i);
                })
            };
        }, 500)
        
        setTimeout(() => clearInterval(tmp), 10000);
        
    } else {
        console.log('Desintegrating: ', item)
        getTheJobDone(item);
    }
    
    
        // item.scrollIntoView({behavior: 'smooth'});
        // setTimeout(() => {
            
        // }, 2000)
        
    
    console.log('Desintegration complete')
}



let btn;


btn = document.body.appendChild(document.createElement('div'))
btn.style.position = 'fixed';
btn.style.bottom = '10px';
btn.style.zIndex = 99999;
btn.id = 'doomsday'



btn = document.getElementById('doomsday').appendChild(document.createElement('input'))
btn.type = 'text'
btn.id = 'thanos_input'
btn.value = original_query
btn.onchange = event => {
    original_query = event.target.value
}



btn = document.getElementById('doomsday').appendChild(document.createElement('button'))
btn.textContent = 'PURGE'
btn.onclick = () => {
    let max_elements = 5;
    let cloned_elements = 0;
    const participants = document.querySelectorAll(original_query);
    let randomness = () => true;
    if (participants > max_elements) {
        randomness = () => Boolean(Math.round(Math.random()))
    } 


    // console.log('participants', participants)
    Array.from(participants).forEach(item => {
        if (cloned_elements < max_elements && randomness()) {
            // console.log('This has come to end: ', item)
            cloneCanvas(item);
            cloned_elements++;
            
        }
    });
    desintegrate();
    
}



btn = document.getElementById('doomsday').appendChild(document.createElement('button'));
btn.textContent = 'Restore';
btn.onclick = restotreAll;





// btn = document.getElementById('doomsday').appendChild(document.createElement('button'));
// btn.textContent = 'Clone';
// btn.onclick = () => cloneCanvas(document.querySelector(original_query));

// btn = document.body.appendChild(document.createElement('button'));
// btn.textContent = 'Connect';
// btn.onclick = () => {
//     Array.from(document.getElementsByClassName(fake_cls)).forEach(item => 
//         item.style.position = 'absolute'
//         )
// }


// btn = document.getElementById('doomsday').appendChild(document.createElement('button'));
// btn.textContent = 'Desintegrate';
// btn.onclick = () => desintegrate();