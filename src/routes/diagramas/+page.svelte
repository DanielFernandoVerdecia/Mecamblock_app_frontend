<script lang="ts">
  import { onMount } from 'svelte';
  import { enrutador } from '../../routes/router_now';

  interface ChartData {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string;
      borderWidth?: number;
      fill?: boolean;
      tension?: number;
    }[];
  }

  let chartContainer: HTMLDivElement;
  let selectedMetric = $state('produccion');
  let selectedPeriodo = $state('semana');
  let chartType = $state('bar');

  // Generar datos aleatorios
  function generateProductionData() {
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const data = dias.map(() => Math.floor(Math.random() * 500) + 200);
    return { labels: dias, data };
  }

  function generateMonthlyData() {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const data = meses.map(() => Math.floor(Math.random() * 5000) + 2000);
    return { labels: meses, data };
  }

  function generateProductComparison() {
    const productos = ['Bloques A', 'Bloques B', 'Bloques C', 'Bloques D', 'Bloques E', 'Bloques F'];
    const data = productos.map(() => Math.floor(Math.random() * 1000) + 500);
    return { labels: productos, data };
  }

  function generateQualityData() {
    const categorias = ['Excelente', 'Bueno', 'Regular', 'Defectuoso'];
    const data = [Math.floor(Math.random() * 400) + 300, Math.floor(Math.random() * 200) + 100, Math.floor(Math.random() * 80) + 20, Math.floor(Math.random() * 50) + 10];
    return { labels: categorias, data };
  }

  function generateOperaryEfficiency() {
    const operarios = ['Op. 1', 'Op. 2', 'Op. 3', 'Op. 4', 'Op. 5', 'Op. 6', 'Op. 7'];
    const data = operarios.map(() => Math.floor(Math.random() * 30) + 70);
    return { labels: operarios, data };
  }

  function generateTrendData() {
    const semanas = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5'];
    const produccion = semanas.map(() => Math.floor(Math.random() * 1000) + 2000);
    const ventas = semanas.map(() => Math.floor(Math.random() * 5000) + 15000);
    const defectos = semanas.map(() => Math.floor(Math.random() * 100) + 20);
    return { labels: semanas, produccion, ventas, defectos };
  }

  let canvases = $state<{ [key: string]: HTMLCanvasElement | null }>({});
  let charts = $state<{ [key: string]: any }>({});

  async function initCharts() {
    try {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);

      // Chart 1: Producción por día
      const prodCtx = canvases['produccion'];
      if (prodCtx) {
        const { labels, data } = generateProductionData();
        if (charts['produccion']) charts['produccion'].destroy();
        charts['produccion'] = new Chart(prodCtx, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Unidades Producidas',
              data,
              backgroundColor: '#4f83f7',
              borderRadius: 8,
              borderSkipped: false
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: { labels: { color: '#fff' } },
              title: { display: true, text: 'Producción por Día', color: '#fff' }
            },
            scales: {
              y: { ticks: { color: '#fff' }, grid: { color: '#4f83f733' } },
              x: { ticks: { color: '#fff' }, grid: { color: '#4f83f733' } }
            }
          }
        });
      }

      // Chart 2: Comparación de productos
      const prodCompCtx = canvases['productComparison'];
      if (prodCompCtx) {
        const { labels, data } = generateProductComparison();
        if (charts['productComparison']) charts['productComparison'].destroy();
        charts['productComparison'] = new Chart(prodCompCtx, {
          type: 'doughnut',
          data: {
            labels,
            datasets: [{
              data,
              backgroundColor: [
                '#76a9fa',
                '#4f83f7',
                '#3d6fd8',
                '#2b5ac2',
                '#1945ab',
                '#073095'
              ]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: { labels: { color: '#fff' }, position: 'bottom' },
              title: { display: true, text: 'Distribución de Productos', color: '#fff' }
            }
          }
        });
      }

      // Chart 3: Calidad
      const qualityCtx = canvases['quality'];
      if (qualityCtx) {
        const { labels, data } = generateQualityData();
        if (charts['quality']) charts['quality'].destroy();
        charts['quality'] = new Chart(qualityCtx, {
          type: 'pie',
          data: {
            labels,
            datasets: [{
              data,
              backgroundColor: [
                '#4caf50',
                '#ff9800',
                '#ff5722',
                '#f44336'
              ]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: { labels: { color: '#fff' }, position: 'bottom' },
              title: { display: true, text: 'Estatus de Calidad', color: '#fff' }
            }
          }
        });
      }

      // Chart 4: Eficiencia de operarios
      const effCtx = canvases['efficiency'];
      if (effCtx) {
        const { labels, data } = generateOperaryEfficiency();
        if (charts['efficiency']) charts['efficiency'].destroy();
        charts['efficiency'] = new Chart(effCtx, {
          type: 'radar',
          data: {
            labels,
            datasets: [{
              label: 'Eficiencia (%)',
              data,
              borderColor: '#76a9fa',
              backgroundColor: 'rgba(118, 169, 250, 0.2)',
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: { labels: { color: '#fff' } },
              title: { display: true, text: 'Eficiencia por Operario', color: '#fff' }
            },
            scales: {
              r: {
                ticks: { color: '#fff' },
                grid: { color: '#4f83f733' }
              }
            }
          }
        });
      }

      // Chart 5: Tendencias
      const trendCtx = canvases['trends'];
      if (trendCtx) {
        const { labels, produccion, ventas, defectos } = generateTrendData();
        if (charts['trends']) charts['trends'].destroy();
        charts['trends'] = new Chart(trendCtx, {
          type: 'line',
          data: {
            labels,
            datasets: [
              {
                label: 'Producción',
                data: produccion,
                borderColor: '#76a9fa',
                backgroundColor: 'rgba(118, 169, 250, 0.1)',
                tension: 0.4,
                borderWidth: 2
              },
              {
                label: 'Ventas ($100s)',
                data: ventas,
                borderColor: '#4caf50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.4,
                borderWidth: 2
              },
              {
                label: 'Defectos (x10)',
                data: defectos,
                borderColor: '#f44336',
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                tension: 0.4,
                borderWidth: 2
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: { labels: { color: '#fff' } },
              title: { display: true, text: 'Tendencias Mensuales', color: '#fff' }
            },
            scales: {
              y: { ticks: { color: '#fff' }, grid: { color: '#4f83f733' } },
              x: { ticks: { color: '#fff' }, grid: { color: '#4f83f733' } }
            }
          }
        });
      }

      // Chart 6: Comparación mensual
      const monthCtx = canvases['monthly'];
      if (monthCtx) {
        const { labels, data } = generateMonthlyData();
        if (charts['monthly']) charts['monthly'].destroy();
        charts['monthly'] = new Chart(monthCtx, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Producción Mensual',
              data,
              backgroundColor: [
                '#76a9fa', '#4f83f7', '#3d6fd8', '#2b5ac2',
                '#1945ab', '#073095', '#76a9fa', '#4f83f7',
                '#3d6fd8', '#2b5ac2', '#1945ab', '#073095'
              ],
              borderRadius: 8,
              borderSkipped: false
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: { labels: { color: '#fff' } },
              title: { display: true, text: 'Producción Anual', color: '#fff' }
            },
            scales: {
              y: { ticks: { color: '#fff' }, grid: { color: '#4f83f733' } },
              x: { ticks: { color: '#fff' }, grid: { color: '#4f83f733' } }
            }
          }
        });
      }

    } catch (error) {
      console.error('Error inicializando charts:', error);
      alert('Error al cargar los gráficos. Asegúrate de tener chart.js instalado.');
    }
  }

  onMount(() => {
    initCharts();
  });

  function refreshCharts() {
    initCharts();
  }
</script>

<h1 class="page-title">Visualización de Datos & Análisis</h1>

<section>
  <div class="diagrams-container">
    <div class="controls-header">
      <h2>Panel de Métricas</h2>
      <button onclick={refreshCharts} class="btn btn-primary">
        🔄 Actualizar Gráficos
      </button>
    </div>

    <!-- Grid de gráficos -->
    <div class="charts-grid">
      <!-- Chart 1: Producción diaria -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>📊 Producción Diaria</h3>
          <p class="chart-subtitle">Últimos 7 días</p>
        </div>
        <canvas bind:this={canvases['produccion']} class="chart-canvas"></canvas>
        <div class="chart-footer">
          <span class="metric-badge">Total: 2,450 u.</span>
          <span class="metric-badge positive">↑ 12.5%</span>
        </div>
      </div>

      <!-- Chart 2: Comparación de productos -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>🎯 Productos por Línea</h3>
          <p class="chart-subtitle">Distribución actual</p>
        </div>
        <canvas bind:this={canvases['productComparison']} class="chart-canvas"></canvas>
        <div class="chart-footer">
          <span class="metric-badge">6 Productos activos</span>
        </div>
      </div>

      <!-- Chart 3: Calidad -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>✅ Control de Calidad</h3>
          <p class="chart-subtitle">Estado actual</p>
        </div>
        <canvas bind:this={canvases['quality']} class="chart-canvas"></canvas>
        <div class="chart-footer">
          <span class="metric-badge success">94.2% Calidad</span>
        </div>
      </div>

      <!-- Chart 4: Eficiencia operarios -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>👥 Eficiencia de Operarios</h3>
          <p class="chart-subtitle">Rendimiento individual</p>
        </div>
        <canvas bind:this={canvases['efficiency']} class="chart-canvas"></canvas>
        <div class="chart-footer">
          <span class="metric-badge">Promedio: 82%</span>
        </div>
      </div>

      <!-- Chart 5: Tendencias -->
      <div class="chart-card large">
        <div class="chart-header">
          <h3>📈 Tendencias Semanales</h3>
          <p class="chart-subtitle">Producción, Ventas y Defectos</p>
        </div>
        <canvas bind:this={canvases['trends']} class="chart-canvas"></canvas>
        <div class="chart-footer">
          <span class="metric-badge">Semana 5 - Actual</span>
        </div>
      </div>

      <!-- Chart 6: Producción anual -->
      <div class="chart-card large">
        <div class="chart-header">
          <h3>📅 Producción Anual</h3>
          <p class="chart-subtitle">Comparativa por mes</p>
        </div>
        <canvas bind:this={canvases['monthly']} class="chart-canvas"></canvas>
        <div class="chart-footer">
          <span class="metric-badge">Total anual: 45,230 u.</span>
          <span class="metric-badge positive">↑ 8.3%</span>
        </div>
      </div>
    </div>

    <!-- Métricas resumen -->
    <div class="metrics-summary">
      <div class="summary-card">
        <h4>Producción Promedio</h4>
        <p class="summary-value">350</p>
        <p class="summary-unit">unidades/día</p>
      </div>
      <div class="summary-card">
        <h4>Tasa de Defectos</h4>
        <p class="summary-value">5.8%</p>
        <p class="summary-unit">mensual</p>
      </div>
      <div class="summary-card">
        <h4>Eficiencia Promedio</h4>
        <p class="summary-value">82%</p>
        <p class="summary-unit">operarios</p>
      </div>
      <div class="summary-card">
        <h4>Productos en Stock</h4>
        <p class="summary-value">2,450</p>
        <p class="summary-unit">unidades</p>
      </div>
    </div>
  </div>

  <div class="volver-container">
    <button
      type="button"
      class="btn btn-outline-light btn-lg volver-btn"
      onclick={() => enrutador('/ruta_main')}
    >
      Volver al menú principal
    </button>
  </div>
</section>

<style>
  :global(body) {
    background: linear-gradient(135deg, #0a0a0f 0%, #151520 25%, #1a1a2e 50%, #16213e 75%, #0f3460 100%);
    min-height: 100vh;
  }

  .page-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: -1px;
    margin-top: 2rem;
    margin-bottom: 2rem;
    text-shadow: 0 2px 16px #0008;
    text-align: center;
  }

  section {
    min-height: 100vh;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    gap: 2rem;
    padding-bottom: 50px;
    width: 100%;
  }

  .diagrams-container {
    width: 100%;
    max-width: 1600px;
    padding: 0 1rem;
  }

  .controls-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .controls-header h2 {
    color: #76a9fa;
    font-size: 1.8rem;
    margin: 0;
  }

  .btn {
    border-radius: 1rem;
    font-weight: 600;
    padding: 0.7rem 1.5rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 1rem;
  }

  .btn-primary {
    background: linear-gradient(90deg, #76a9fa 0%, #4f83f7 100%);
    color: #fff;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px #4f83f733;
  }

  .btn-outline-light {
    background: transparent;
    color: #fff;
    border: 1.5px solid #fff;
  }

  .btn-outline-light:hover {
    background: #fff;
    color: #4f83f7;
  }

  .btn-lg {
    font-size: 1.2rem;
    padding: 0.8rem 2.2rem;
  }

  .charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .chart-card {
    background: rgba(255, 255, 255, 0.07);
    border-radius: 1.5rem;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.13);
    backdrop-filter: blur(12px);
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.18);
    display: flex;
    flex-direction: column;
    transition: all 0.3s;
  }

  .chart-card:hover {
    background: rgba(255, 255, 255, 0.09);
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(31, 38, 135, 0.25);
  }

  .chart-card.large {
    grid-column: span 2;
  }

  .chart-header {
    margin-bottom: 1rem;
  }

  .chart-header h3 {
    color: #76a9fa;
    font-size: 1.2rem;
    margin: 0 0 0.5rem 0;
  }

  .chart-subtitle {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
    margin: 0;
  }

  .chart-canvas {
    max-height: 300px;
    margin: 1rem 0;
  }

  .chart-footer {
    display: flex;
    gap: 0.5rem;
    margin-top: auto;
    flex-wrap: wrap;
  }

  .metric-badge {
    background: rgba(118, 169, 250, 0.15);
    color: #76a9fa;
    padding: 0.4rem 0.8rem;
    border-radius: 0.6rem;
    font-size: 0.85rem;
    font-weight: 600;
    border: 1px solid rgba(118, 169, 250, 0.3);
  }

  .metric-badge.positive {
    background: rgba(76, 175, 80, 0.15);
    color: #4caf50;
    border-color: rgba(76, 175, 80, 0.3);
  }

  .metric-badge.success {
    background: rgba(76, 175, 80, 0.15);
    color: #4caf50;
    border-color: rgba(76, 175, 80, 0.3);
  }

  .metrics-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .summary-card {
    background: rgba(118, 169, 250, 0.1);
    border: 1px solid rgba(118, 169, 250, 0.3);
    border-radius: 1.2rem;
    padding: 1.5rem;
    text-align: center;
    transition: all 0.3s;
  }

  .summary-card:hover {
    background: rgba(118, 169, 250, 0.15);
    transform: translateY(-2px);
  }

  .summary-card h4 {
    color: #76a9fa;
    font-size: 1rem;
    margin: 0 0 0.5rem 0;
  }

  .summary-value {
    font-size: 2.5rem;
    font-weight: 800;
    color: #fff;
    margin: 0.5rem 0;
  }

  .summary-unit {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.95rem;
    margin: 0;
  }

  .volver-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
    width: 100%;
  }

  .volver-btn {
    width: 100%;
    max-width: 420px;
    border-radius: 1.2rem;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  @media (max-width: 1200px) {
    .chart-card.large {
      grid-column: span 1;
    }

    .charts-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .controls-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .metrics-summary {
      grid-template-columns: repeat(2, 1fr);
    }

    .chart-card {
      padding: 1rem;
    }

    .summary-value {
      font-size: 2rem;
    }
  }
</style>
