//Pagina principal, se movio todo lo que estaba en App.svelte
<script lang="ts">
  let cantidadStr: string = '';
  let total = 0;

  function guardar(): void {
    const n = Number(cantidadStr);
    if (Number.isNaN(n)) return;
    total += n;
  }
</script>

<main class="fondo">

    

  <nav id="navbar">
        <div class="nav-container">

            <a href="#home" class="logo">
                <div class="logo-icon">
                  <img src="src/lib/assets/images/mecamblocklogo.jpg" alt="MecamBlock logo">
                </div>
                <div class="logo-text">MecamBlock</div>
            </a>
            
            <ul class="nav-links">
                <li><a href="#home">Inventario</a></li>

                <p style = "font-size: 20px;">¡Bienvenido!</p>
                
            </ul>

            
      
        </div>
      
    </nav>

    <section id="home" class="hero" >
        <div class="hero-bg-animation">
            <div class="floating-shape shape-1"></div>
            <div class="floating-shape shape-2"></div>
            <div class="floating-shape shape-3"></div>
            <div class="geo-shape geo-1"></div>
            <div class="geo-shape geo-2"></div>
            <div class="particles">
                <span class="particle"></span>
                <span class="particle"></span>
                <span class="particle"></span>
                <span class="particle"></span>
                <span class="particle"></span>
                <span class="particle"></span>
                <span class="particle"></span>
                <span class="particle"></span>
                <span class="particle"></span>
                <span class="particle"></span>
            </div>
        </div>

        <div class="hero-content">
            <h1>MecamBlock</h1>


            
            
            
            <div class="cta-buttons">
                <a href="#portfolio" class="cta-primary">Comunicar</a>
                <a href="#contact" class="cta-secondary">Info</a>
            </div>
            
            <div class="stats-section">
               
                <div class="stat-card">
                    <span class="stat-number">{total}</span>
                    <span class="stat-label">Bloques</span>
                </div>
               
            </div>


            <input type="number" bind:value={cantidadStr} />
            <button type="button" on:click={guardar}>Guardar</button>

         
               


        </div>
    </section>

    


    <footer>
        <div class="footer-bottom">
            <p class="footer-copyright">
                © 2025 H.V. MecamBlock CIA S.A.S 
            </p>
            
        </div>
    </footer>

</main>

<style>

  @charset "utf-8";

  * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
  }

  :root {
      --glass-bg: rgba(255, 255, 255, 0.08);
      --glass-border: rgba(255, 255, 255, 0.15);
      --accent-blue: #76a9fa;
      --accent-blue-dark: #4f83f7;
      --accent-glow: rgba(118, 169, 250, 0.3);
      --text-primary: #ffffff;
      --text-secondary: rgba(255, 255, 255, 0.8);
      --text-tertiary: rgba(255, 255, 255, 0.6);
  }

  .fondo{
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: linear-gradient(135deg, #0a0a0f 0%, #151520 25%, #1a1a2e 50%, #16213e 75%, #0f3460 100%);
    background-attachment: fixed;
    color: var(--text-primary);
    overflow-x: hidden;
    min-height: 100vh;
    line-height: 1.6;
  }

  

  /* Navigation */
  nav {
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 1000;
      padding: 1rem 0;
      transition: all 0.3s ease;
      background: rgba(15, 25, 35, 0.8);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }



  .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem;
      flex-wrap: wrap;
      gap: 1rem;
  }

 



  .logo {

      display: flex;
      align-items: center;
      justify-content: center;
      
      gap: 0.5rem;



      text-decoration: none;
      color: transparent;

    
    

  }

  .logo-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 10px;

  }

  .logo-icon img{
    width: 10rem; 
    height: 10rem; 
    object-fit: cover; 
    

    border-radius: 1rem;
    
  }

  .logo-text {

      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);

  }


 

  .nav-links {
      display: flex;
      list-style: none;
      gap: 1rem;
  }

  .nav-links a {
      color: var(--text-secondary);
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      transition: all 0.3s ease;
      font-weight: 500;
      letter-spacing: 0.5px;
      position: relative;
      border: 2px solid transparent;
  }

  .nav-links a::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 50%;
      width: 0;
      height: 2px;
      background: var(--accent-blue);
      transition: all 0.3s ease;
      transform: translateX(-50%);
  }

  .nav-links a:hover {
      color: var(--accent-blue);
      border-color: var(--accent-blue);
      transform: translateY(-2px);
      background: rgba(118, 169, 250, 0.1);
  }

  .nav-links a:hover::after {
      width: 60%;
  }



  /* Section styling */
  section {
      padding: 5rem 0;
      position: relative;
  }

 

  /* Hero section */
  .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 160px 2rem 0;
      position: relative;
      overflow: hidden;
  }

  /* Animated background elements */
  .hero-bg-animation {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      z-index: 1;
  }

  .floating-shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      opacity: 0.6;
      animation: float 25s infinite ease-in-out;
  }

  .shape-1 {
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(118, 169, 250, 0.4) 0%, transparent 70%);
      top: -200px;
      left: -200px;
      animation-delay: 0s;
  }

  .shape-2 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(79, 131, 247, 0.3) 0%, transparent 70%);
      top: 50%;
      right: -150px;
      animation-delay: 7s;
  }

  .shape-3 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(118, 169, 250, 0.35) 0%, transparent 70%);
      bottom: -100px;
      left: 20%;
      animation-delay: 14s;
  }

  /* Geometric shapes */
  .geo-shape {
      position: absolute;
      opacity: 0.1;
      animation: rotate-float 30s infinite linear;
  }

  .geo-1 {
      width: 300px;
      height: 300px;
      top: 20%;
      right: 10%;
      background: radial-gradient(666px at 0.4% 48%, rgb(202, 204, 227) 0%, rgb(89, 89, 99) 97.5%);
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }

  .geo-2 {
      width: 250px;
      height: 250px;
      bottom: 20%;
      left: 5%;
      background: linear-gradient(135deg, var(--accent-blue-dark) 0%, transparent 100%);
      border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
      animation-delay: -10s;
  }

  @keyframes float {
      0%, 100% {
          transform: translate(0, 0) scale(1) rotate(0deg);
      }
      25% {
          transform: translate(100px, -80px) scale(1.1) rotate(90deg);
      }
      50% {
          transform: translate(-60px, 60px) scale(0.9) rotate(180deg);
      }
      75% {
          transform: translate(80px, 100px) scale(1.05) rotate(270deg);
      }
  }

  @keyframes rotate-float {
      0% {
          transform: rotate(0deg) translateY(0);
      }
      50% {
          transform: rotate(180deg) translateY(-50px);
      }
      100% {
          transform: rotate(360deg) translateY(0);
      }
  }

  .particles {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
  }

  .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: radial-gradient(666px at 0.4% 48%, rgb(202, 204, 227) 0%, rgb(89, 89, 99) 97.5%);
      border-radius: 50%;
      opacity: 0;
      animation: particle-rise 10s infinite ease-out;
  }

  @keyframes particle-rise {
      0% {
          opacity: 0;
          transform: translateY(100vh) scale(0);
      }
      10% {
          opacity: 1;
      }
      90% {
          opacity: 1;
      }
      100% {
          opacity: 0;
          transform: translateY(-100px) scale(1);
      }
  }

  /* Generate multiple particles */
  .particle:nth-child(1) { left: 10%; animation-delay: 0s; }
  .particle:nth-child(2) { left: 20%; animation-delay: 1s; }
  .particle:nth-child(3) { left: 30%; animation-delay: 2s; }
  .particle:nth-child(4) { left: 40%; animation-delay: 3s; }
  .particle:nth-child(5) { left: 50%; animation-delay: 4s; }
  .particle:nth-child(6) { left: 60%; animation-delay: 5s; }
  .particle:nth-child(7) { left: 70%; animation-delay: 6s; }
  .particle:nth-child(8) { left: 80%; animation-delay: 7s; }
  .particle:nth-child(9) { left: 90%; animation-delay: 8s; }
  .particle:nth-child(10) { left: 95%; animation-delay: 9s; }

  .hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 25% 25%, var(--accent-glow) 0%, transparent 50%);
      animation: hero-glow 8s ease-in-out infinite;
      z-index: 1;
  }

  @keyframes hero-glow {
      0%, 100% { 
          transform: scale(1) rotate(0deg);
          opacity: 0.7;
      }
      50% { 
          transform: scale(1.1) rotate(2deg);
          opacity: 1;
      }
  }

  .hero-content {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      max-width: 1000px;
      margin: 0 auto;
  }

  .hero h1 {
      font-size: clamp(2.5rem, 8vw, 5rem);
      font-weight: 800;
      margin-bottom: 1.5rem;
      color: var(--text-primary);
      line-height: 1.1;
      letter-spacing: -2px;
      animation: slideInUp 1s ease-out;
  }


  .cta-buttons {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 2rem;
      animation: slideInUp 1s ease-out 0.6s both;
  }

  .cta-primary, .cta-secondary {
      padding: 1rem 2rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      display: inline-block;
  }

  .cta-primary {
      background: linear-gradient(135deg, var(--accent-blue), var(--accent-blue-dark));
      color: white;
      box-shadow: 0 8px 25px var(--accent-glow);
  }

  .cta-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px var(--accent-glow);
  }

  .cta-secondary {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      color: white;
  }

  .cta-secondary:hover {
      background: rgba(255, 255, 255, 0.12);
      transform: translateY(-3px);
  }

  @keyframes slideInUp {
      from {
          opacity: 0;
          transform: translateY(50px);
      }
      to {
          opacity: 1;
          transform: translateY(0);
      }
  }

  /* Stats */
  .stats-section {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-top: 4rem;
      flex-wrap: wrap;
  }

  .stat-card {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 20px;
      padding: 2rem;
      text-align: center;
      min-width: 150px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
  }

  .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  }

  .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-primary);
      display: block;
  }

  .stat-label {
      font-size: 1rem;
      color: var(--text-secondary);
      margin-top: 0.5rem;
  }










  /* Footer */
  footer {
      background: linear-gradient(135deg, 
          rgba(15, 25, 35, 0.95) 0%,
          rgba(10, 15, 25, 0.95) 100%);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding: 2rem 0;
      margin-top: 4rem;
  }

  .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 2rem;
  }

  .footer-copyright {
      color: var(--text-tertiary);
      font-size: 0.9rem;
  }





  




 

</style>
