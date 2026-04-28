tsParticles.load("tsparticles", {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: ["#8b5cf6", "#22d3ee", "#ffffff"] // ფერები თემიდან
        },
        shape: {
            type: "circle"
        },
        opacity: {
            value: 0.5,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#8b5cf6",
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: true,
                mode: "grab" // მაუსის მიახლოებაზე იზიდავს
            },
            onclick: {
                enable: true,
                mode: "push" // დაწკაპუნებაზე ამატებს
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: {
                    opacity: 0.5
                }
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
}); 
tsParticles.load("tsparticles", {
    particles: {
        number: { value: 60 },
        color: { value: "#8b5cf6" },
        links: { enable: true, color: "#8b5cf6", opacity: 0.2 },
        move: { enable: true, speed: 1.5 }
    }
});
