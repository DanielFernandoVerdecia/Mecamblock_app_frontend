<script lang="ts">
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/authStore';

  let username = '';
  let password = '';
  let error = '';
  let isLoading = false;

  async function handleLogin() {
    error = '';
    isLoading = true;

    if (!username.trim() || !password.trim()) {
      error = 'Usuario y contraseña son requeridos';
      isLoading = false;
      return;
    }

    const success = authStore.login(username, password);

    if (success) {
      goto('/ruta_main');
    } else {
      error = 'Usuario o contraseña incorrectos';
    }

    isLoading = false;
  }

  function handleKeyPress(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      handleLogin();
    }
  }
</script>

<main class="login-container">
  <div class="login-bg">
    <div class="floating-shape shape-1"></div>
    <div class="floating-shape shape-2"></div>
    <div class="floating-shape shape-3"></div>
    <div class="particles">
      {#each Array(10) as _, i}
        <span class="particle" style="--delay: {i}s"></span>
      {/each}
    </div>
  </div>

  <div class="login-card">
    <div class="login-header">
      <div class="logo-big">
        <img src="/images/mecamblocklogo.jpg" alt="MecamBlock" />
      </div>
      <h1>MecamBlock</h1>
      <p>Administrador</p>
    </div>

    <form on:submit|preventDefault={handleLogin}>
      {#if error}
        <div class="error-message">
          <span>⚠️ {error}</span>
        </div>
      {/if}

      <div class="form-group">
        <label for="username">Usuario</label>
        <input
          id="username"
          type="text"
          placeholder="Ingresa tu usuario"
          bind:value={username}
          on:keypress={handleKeyPress}
          disabled={isLoading}
          class="input"
        />
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <input
          id="password"
          type="password"
          placeholder="Ingresa tu contraseña"
          bind:value={password}
          on:keypress={handleKeyPress}
          disabled={isLoading}
          class="input"
        />
      </div>

      <button type="submit" disabled={isLoading} class="btn-login">
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>

    <div class="demo-info">
      <p><strong>Demo:</strong></p>
      <p>Usuario: <code>admin</code></p>
      <p>Contraseña: <code>admin</code></p>
    </div>
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }

  .login-container {
    width: 100%;
    height: 100vh;
    background: linear-gradient(135deg, #0a0a0f 0%, #151520 25%, #1a1a2e 50%, #16213e 75%, #0f3460 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  }

  .login-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    overflow: hidden;
  }

  .floating-shape {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.4;
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

  .particles {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(202, 204, 227, 0.6);
    border-radius: 50%;
    opacity: 0;
    animation: particle-rise 10s infinite ease-out;
    animation-delay: var(--delay, 0s);
  }

  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    25% {
      transform: translate(100px, -80px) scale(1.1);
    }
    50% {
      transform: translate(-60px, 60px) scale(0.9);
    }
    75% {
      transform: translate(80px, 100px) scale(1.05);
    }
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

  .login-card {
    position: relative;
    z-index: 10;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 2rem;
    padding: 3rem 2rem;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.3);
    animation: slideInUp 0.8s ease-out;
  }

  .login-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .logo-big {
    width: 120px;
    height: 120px;
    margin: 0 auto 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo-big img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 1rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }

  .login-header h1 {
    font-size: 2.5rem;
    font-weight: 800;
    color: #ffffff;
    margin: 0;
    letter-spacing: -1px;
  }

  .login-header p {
    font-size: 1.1rem;
    color: #76a9fa;
    margin: 0.5rem 0 0 0;
    font-weight: 600;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .error-message {
    background: rgba(255, 77, 79, 0.15);
    border: 1px solid #ff4d4f;
    border-radius: 1rem;
    padding: 0.9rem 1.2rem;
    color: #ff4d4f;
    font-weight: 600;
    text-align: center;
    font-size: 1rem;
    animation: shake 0.5s ease-in-out;
  }

  @keyframes shake {
    0%, 100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-5px);
    }
    75% {
      transform: translateX(5px);
    }
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .form-group label {
    color: #76a9fa;
    font-weight: 700;
    font-size: 1rem;
    letter-spacing: 0.5px;
  }

  .input {
    width: 100%;
    padding: 1rem 1.2rem;
    border-radius: 1rem;
    border: 1px solid #4f83f7;
    background: rgba(255, 255, 255, 0.12);
    color: #ffffff;
    font-size: 1.05rem;
    outline: none;
    transition: all 0.3s ease;
  }

  .input::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  .input:focus {
    border-color: #76a9fa;
    background: rgba(255, 255, 255, 0.16);
    box-shadow: 0 0 0 3px rgba(118, 169, 250, 0.1);
  }

  .input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-login {
    padding: 1rem 1.5rem;
    border-radius: 1.2rem;
    background: linear-gradient(135deg, #76a9fa 0%, #4f83f7 100%);
    color: #ffffff;
    font-size: 1.1rem;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 20px rgba(118, 169, 250, 0.3);
    margin-top: 0.5rem;
  }

  .btn-login:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 28px rgba(118, 169, 250, 0.4);
    background: linear-gradient(135deg, #4f83f7 0%, #76a9fa 100%);
  }

  .btn-login:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .demo-info {
    background: rgba(76, 175, 80, 0.08);
    border: 1px solid rgba(76, 175, 80, 0.3);
    border-radius: 1rem;
    padding: 1rem;
    margin-top: 1rem;
    font-size: 0.95rem;
    color: #4caf50;
  }

  .demo-info p {
    margin: 0.3rem 0;
    font-size: 0.95rem;
  }

  .demo-info code {
    background: rgba(76, 175, 80, 0.15);
    padding: 0.2rem 0.6rem;
    border-radius: 0.5rem;
    font-family: 'Courier New', monospace;
    font-weight: 600;
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 600px) {
    .login-card {
      max-width: 95vw;
      padding: 2rem 1.5rem;
    }

    .login-header h1 {
      font-size: 2rem;
    }

    .logo-big {
      width: 100px;
      height: 100px;
    }
  }
</style>
