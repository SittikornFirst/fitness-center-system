<!-- Footer.vue -->
<template>
    <footer class="site-footer">
        <div class="footer-content">
            <div class="footer-section">
                <h3>About Us</h3>
                <p>We provide high-quality online courses to help you achieve your fitness and wellness goals.</p>
            </div>
            
            <div class="footer-section">
                <h3>Quick Links</h3>
                <ul>
                    <li><router-link to="/">Home</router-link></li>
                    <li><router-link to="/courses">Course</router-link></li>
                    <li><a href="mailto: sittikornsfirst@gmail.com">Contact</a></li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h3>Contact Info</h3>
                <ul>
                    <li><i class="fas fa-envelope"></i><a href="mailto: sittikornsfirst@gmail.com"></a> sittikornsfirst@gmail.com </li>
                    <li><i class="fas fa-map-marker-alt"></i> Bangkok, 10160</li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h3>Follow Me</h3>
                <div class="social-links">
                    <a href="https://www.facebook.com/sittikorn.first.2024" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
                    <a href="https://www.twitch.tv/fffffirst" aria-label="Twitch"><i class="fab fa-twitter"></i></a>
                    <a href="https://www.instagram.com/sittikorn_first/" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                    <a href="https://www.linkedin.com/in/sittikorn-maneewong/" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
                    <a href="https://github.com/SittikornFirst"><i class="fab fa-github"></i></a>
                </div>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p>&copy; {{ currentYear }} Fitness Center System. All rights reserved.</p>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'TheFooter',
    computed: {
        currentYear() {
            return new Date().getFullYear();
        }
    }
}
</script>

<style scoped>
.site-footer {
    background-color: #333;
    color: #fff;
    padding: 3rem 0 1rem;
    margin-top: auto;
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    padding: 0 2rem;
}

.footer-section h3 {
    color: #ff6767;
    margin-bottom: 1.2rem;
    font-size: 1.2rem;
}

.footer-section ul {
    list-style: none;
    padding: 0;
}

.footer-section ul li {
    margin-bottom: 0.8rem;
}

.footer-section a {
    color: #fff;
    text-decoration: none;
    transition: color 0.3s;
}

.footer-section a:hover {
    color: #ff6767;
}

.social-links {
    display: flex;
    gap: 1rem;
}

.social-links a {
    color: #fff;
    font-size: 1.5rem;
    transition: color 0.3s;
}

.social-links a:hover {
    color: #ff6767;
}

.footer-bottom {
    text-align: center;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #555;
}

@media (max-width: 768px) {
    .footer-content {
        grid-template-columns: 1fr;
        text-align: center;
    }
    
    .social-links {
        justify-content: center;
    }
}
</style>