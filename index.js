const h1Elements = []
const h1Array = [...document.querySelectorAll('h1')]
const specialChars = [...`!@#$%^&*()_+,./ekoeqiwzxlsapj`.split('')]

class Header{
    constructor(id, element){
        this.id = id 
        this.idx = 0
        this.frame = 0
        this.element = element
        this.element.className = `${id}`
        this.originalString = element.innerText 
        this.innerHTML = ''
        this.intersecting = false 
        this.createSpan()
    }
    createSpan(){
        for (let i = 0; i < this.originalString.length; i++) {
            this.innerHTML += `<span>${this.originalString[i]}</span>`;
        }
        this.element.innerHTML = this.innerHTML
        this.spans = [...this.element.querySelectorAll('span')]
    }
    // 3프레임마다 한번씩 해당 위치(this.idx)의 글자를 랜덤한 문자로 변경함
    // 35프레임이 되면 해당 위치(this.idx)의 글자를 원본 문자로 변경함
    // 해당 위치의 문자변경이 끝났으므로 다음 문자를 변경하기 위하여 글자 위치 이동(this.idx++)
    // 3프레임마다 해당 위치의 글자를 변경하고 변경이 끝나면 다음 위치로 이동해서 글자를 변경함
    // 마지막 글자의 변경이 끝나면 조건문을 빠져나옴
    animate(){
        if(this.idx !== this.originalString.length && this.intersecting){
            this.spans[this.idx].style.opacity = 1
            this.spans[this.idx].style.transform = `translateX(0)`

            // 3프레임마다 한번씩 랜덤문자로 변경
            if(this.frame % 3 == 0 && this.spans[this.idx].innerText !== ' '){
                this.spans[this.idx].innerText = specialChars[Math.floor(Math.random() * specialChars.length)]

            }
            // 35프레임 (60프레임이 보통 1초이므로 약 0.5초) 마다 원래 글자로 보여주기
            if(this.frame % 35 == 0 && this.frame !== 0){
                this.spans[this.idx].innerText = this.originalString[this.idx]
                this.idx++
            }
            this.frame++
            requestAnimationFrame(this.animate.bind(this))
        }else{
            console.log('done')
        }
    }
    // 애니메이션을 추후 다시 적용하기 위하여 모든 변수를 초기화
    reset(){
        this.idx = 0
        this.frame = 0
        this.intersecting = false 
        this.spans.forEach(span => {
            span.style.opacity = 0
            span.style.transform = `translateX(-10px)`
        })
    }
}

setTimeout(() => {
    h1Array.forEach((header, idx) => {
        h1Elements[idx] = new Header(idx, header)
    })
    
    let options = {
        rootMargin: '0px',
        threshold: 0.0
    }
    
    let callback = (entries => {
        entries.forEach(entry => {
            console.log(entries)
            if(entry.isIntersecting){
                h1Elements[+entry.target.className].intersecting = true 
                h1Elements[+entry.target.className].animate()
            }else{
                h1Elements[+entry.target.className].reset()
            }
        })
    })
    
    let observer = new IntersectionObserver(callback, options)
    
    h1Elements.forEach(instance => {
        observer.observe(instance.element)
        instance.element.style.opacity = 1
    })
}, 1000)
