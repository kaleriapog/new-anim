document.addEventListener('DOMContentLoaded', () => {
    let btn = document.querySelectorAll(".btn")
    let canvas = document.querySelector('canvas')
    let calendar = document.querySelector('.calendar')
    let calendarPages = document.querySelectorAll('.calendar-page')
    let anim9 = document.querySelector('.anim-9')
    let anim10Page = document.querySelector('.anim-10')

    if(btn) {
        btn.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();

                let x = e.pageX - e.target.offsetLeft;
                let y = e.pageY - e.target.offsetTop;

                let ripples = document.createElement("span");

                ripples.style.left = x + 'px'
                ripples.style.top = y + 'px'

                this.appendChild(ripples);

                setTimeout(() => {
                    ripples.remove()

                }, 1000)
            })
        })
    }

    if(canvas) {
        plot();
        function plot()
        {
            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext('2d');

            ctx.beginPath();
            ctx.arc(200,  90, 5, 0, Math.PI*2, true);
            ctx.stroke();

            ctx.setLineDash([5,7]);
            ctx.beginPath();
            ctx.moveTo(10,30);
            ctx.lineTo(200,90);
            ctx.lineTo(200,5);
            ctx.stroke();
        }
    }

    if(calendar) {
        calendarPages.forEach((calendarPage) => {
            calendarPage.addEventListener('click', (e) => {
                e.target.closest('.calendar-page').classList.add('torn-off')
            })
        })
    }

    if(anim9) {
        console.clear();

        const friction = -0.5;

        const ball = document.querySelector(".ball");
        const ballProps = gsap.getProperty(ball);
        const radius = ball.getBoundingClientRect().width / 2;
        const tracker = InertiaPlugin.track(ball, "x,y")[0];

        let vw = window.innerWidth;
        let vh = window.innerHeight;

        gsap.defaults({
            overwrite: true
        });

        gsap.set(ball, {
            xPercent: -50,
            yPercent: -50,
            x: vw / 2,
            y: vh / 2
        });

        const draggable = new Draggable(ball, {
            bounds: window,
            onPress() {
                gsap.killTweensOf(ball);
                this.update();
            },
            onDragEnd: animateBounce,
            onDragEndParams: []
        });

        window.addEventListener("resize", () => {
            vw = window.innerWidth;
            vh = window.innerHeight;
        });

        function animateBounce(x = "+=0", y = "+=0", vx = "auto", vy = "auto") {

            gsap.fromTo(ball, { x, y }, {
                inertia: {
                    x: vx,
                    y: vy,
                },
                onUpdate: checkBounds
            });
        }

        function checkBounds() {

            let r = radius;
            let x = ballProps("x");
            let y = ballProps("y");
            let vx = tracker.get("x");
            let vy = tracker.get("y");
            let xPos = x;
            let yPos = y;

            let hitting = false;

            if (x + r > vw) {
                xPos = vw - r;
                vx *= friction;
                hitting = true;

            } else if (x - r < 0) {
                xPos = r;
                vx *= friction;
                hitting = true;
            }

            if (y + r > vh) {
                yPos = vh - r;
                vy *= friction;
                hitting = true;

            } else if (y - r < 0) {
                yPos = r;
                vy *= friction;
                hitting = true;
            }

            if (hitting) {
                animateBounce(xPos, yPos, vx, vy);
            }
        }

    }

    if(anim10Page) {

    }
})

$(document).ready(function() {
    const $app = $('.app');
    const $img = $('.app__img');
    const $pageNav1 = $('.pages__item--1');
    const $pageNav2 = $('.pages__item--2');
    let animation = true;
    let curSlide = 1;
    let scrolledUp, nextSlide;

    let pagination = function(slide, target) {
        animation = true;
        if (target === undefined) {
            nextSlide = scrolledUp ? slide - 1 : slide + 1;
        } else {
            nextSlide = target;
        }

        $('.pages__item--' + nextSlide).addClass('page__item-active');
        $('.pages__item--' + slide).removeClass('page__item-active');

        $app.toggleClass('active');
        setTimeout(function() {
            animation = false;
        }, 3000)
    }

    let navigateDown = function() {
        if (curSlide > 1) return;
        scrolledUp = false;
        pagination(curSlide);
        curSlide++;
    }

    let navigateUp = function() {
        if (curSlide === 1) return;
        scrolledUp = true;
        pagination(curSlide);
        curSlide--;
    }

    setTimeout(function() {
        $app.addClass('initial');
    }, 1500);

    setTimeout(function() {
        animation = false;
    }, 4500);

    $(document).on('mousewheel DOMMouseScroll', function(e) {
        var delta = e.originalEvent.wheelDelta;
        if (animation) return;
        if (delta > 0 || e.originalEvent.detail < 0) {
            navigateUp();
        } else {
            navigateDown();
        }
    });

    $(document).on("click", ".pages__item:not(.page__item-active)", function() {
        if (animation) return;
        let target = +$(this).attr('data-target');
        pagination(curSlide, target);
        curSlide = target;
    });
});