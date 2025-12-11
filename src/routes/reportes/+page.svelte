<script lang="ts">
  import { enrutador } from '../../routes/router_now';

  // Tipos
  interface MetricasMensuales {
    mes: string;
    ventasProductos: number;
    fabricacionTotal: number;
    heurasOperarios: number;
    ausentismoTotal: number;
    defectosRegistrados: number;
    mantenimientos: number;
  }

  interface ReporteMetricas {
    mesActual: MetricasMensuales;
    mesPasado: MetricasMensuales;
    porcentajeIncrementoVentas: number;
    porcentajeIncrementoFabricacion: number;
    tasaAusentismo: number;
    tasaDefectos: number;
    eficienciaOperativa: number;
  }

  let reportData = $state<ReporteMetricas | null>(null);
  let isLoading = $state(false);
  let selectedFormat = $state<'pdf' | 'excel'>('pdf');

  // Obtener datos de localStorage
  function generateReportMetrics(): ReporteMetricas {
    const mesActual: MetricasMensuales = {
      mes: new Date().toLocaleString('es-ES', { month: 'long', year: 'numeric' }),
      ventasProductos: Math.floor(Math.random() * 50000) + 30000,
      fabricacionTotal: Math.floor(Math.random() * 1000) + 500,
      heurasOperarios: Math.floor(Math.random() * 500) + 300,
      ausentismoTotal: Math.floor(Math.random() * 50) + 10,
      defectosRegistrados: Math.floor(Math.random() * 100) + 5,
      mantenimientos: Math.floor(Math.random() * 30) + 5
    };

    const mesPasado: MetricasMensuales = {
      mes: new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleString('es-ES', { month: 'long', year: 'numeric' }),
      ventasProductos: Math.floor(Math.random() * 45000) + 25000,
      fabricacionTotal: Math.floor(Math.random() * 950) + 400,
      heurasOperarios: Math.floor(Math.random() * 480) + 280,
      ausentismoTotal: Math.floor(Math.random() * 60) + 15,
      defectosRegistrados: Math.floor(Math.random() * 120) + 10,
      mantenimientos: Math.floor(Math.random() * 35) + 8
    };

    const porcentajeIncrementoVentas = ((mesActual.ventasProductos - mesPasado.ventasProductos) / mesPasado.ventasProductos) * 100;
    const porcentajeIncrementoFabricacion = ((mesActual.fabricacionTotal - mesPasado.fabricacionTotal) / mesPasado.fabricacionTotal) * 100;
    const tasaAusentismo = (mesActual.ausentismoTotal / mesActual.heurasOperarios) * 100;
    const tasaDefectos = (mesActual.defectosRegistrados / mesActual.fabricacionTotal) * 100;
    const eficienciaOperativa = 100 - tasaAusentismo - tasaDefectos;

    return {
      mesActual,
      mesPasado,
      porcentajeIncrementoVentas,
      porcentajeIncrementoFabricacion,
      tasaAusentismo,
      tasaDefectos,
      eficienciaOperativa
    };
  }

  function loadReport() {
    isLoading = true;
    setTimeout(() => {
      reportData = generateReportMetrics();
      isLoading = false;
    }, 500);
  }

  async function exportToPDF() {
    if (!reportData) return;

    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      // Título
      doc.setFontSize(20);
      doc.text('Reporte Mensual - MecamBlock', 10, 20);

      // Información general
      doc.setFontSize(10);
      doc.text(`Mes: ${reportData.mesActual.mes}`, 10, 35);
      doc.text(`Fecha de generación: ${new Date().toLocaleString('es-ES')}`, 10, 42);

      // Métricas principales
      doc.setFontSize(14);
      doc.text('Métricas Principales', 10, 55);

      const metrics = [
        [`Ventas (${reportData.mesActual.mes}):`, `$${reportData.mesActual.ventasProductos.toLocaleString()}`],
        [`Fabricación Total:`, `${reportData.mesActual.fabricacionTotal} unidades`],
        [`Horas Operarios:`, `${reportData.mesActual.heurasOperarios} hrs`],
        [`Ausentismo:`, `${reportData.mesActual.ausentismoTotal} registros`],
        [`Defectos:`, `${reportData.mesActual.defectosRegistrados} unidades`],
        [`Mantenimientos:`, `${reportData.mesActual.mantenimientos} realizados`]
      ];

      let yPos = 65;
      metrics.forEach(([label, value]) => {
        doc.setFontSize(10);
        doc.text(label, 10, yPos);
        doc.text(value, 100, yPos);
        yPos += 8;
      });

      // Comparativa mes anterior
      doc.setFontSize(14);
      doc.text('Comparativa con Mes Anterior', 10, yPos + 10);

      yPos += 20;
      const comparativas = [
        [`Incremento Ventas:`, `${reportData.porcentajeIncrementoVentas.toFixed(2)}%`],
        [`Incremento Fabricación:`, `${reportData.porcentajeIncrementoFabricacion.toFixed(2)}%`],
        [`Tasa Ausentismo:`, `${reportData.tasaAusentismo.toFixed(2)}%`],
        [`Tasa Defectos:`, `${reportData.tasaDefectos.toFixed(2)}%`],
        [`Eficiencia Operativa:`, `${reportData.eficienciaOperativa.toFixed(2)}%`]
      ];

      comparativas.forEach(([label, value]) => {
        doc.setFontSize(10);
        doc.text(label, 10, yPos);
        doc.text(value, 100, yPos);
        yPos += 8;
      });

      // Guardar PDF
      doc.save(`Reporte-MecamBlock-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar PDF. Por favor, intenta de nuevo. Si el problema persiste, asegúrate de que jsPDF está instalado correctamente.');
    }
  }

  function exportToCSV() {
    if (!reportData) return;

    const csv = [
      ['Reporte Mensual - MecamBlock'],
      ['Mes', reportData.mesActual.mes],
      ['Fecha de generación', new Date().toLocaleString('es-ES')],
      [],
      ['Métricas Principales'],
      ['Ventas', reportData.mesActual.ventasProductos],
      ['Fabricación Total', reportData.mesActual.fabricacionTotal],
      ['Horas Operarios', reportData.mesActual.heurasOperarios],
      ['Ausentismo', reportData.mesActual.ausentismoTotal],
      ['Defectos', reportData.mesActual.defectosRegistrados],
      ['Mantenimientos', reportData.mesActual.mantenimientos],
      [],
      ['Comparativa con Mes Anterior'],
      ['Incremento Ventas (%)', reportData.porcentajeIncrementoVentas.toFixed(2)],
      ['Incremento Fabricación (%)', reportData.porcentajeIncrementoFabricacion.toFixed(2)],
      ['Tasa Ausentismo (%)', reportData.tasaAusentismo.toFixed(2)],
      ['Tasa Defectos (%)', reportData.tasaDefectos.toFixed(2)],
      ['Eficiencia Operativa (%)', reportData.eficienciaOperativa.toFixed(2)]
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte-MecamBlock-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }

  function getMetricaColor(valor: number, isPositive: boolean = true): string {
    if (isPositive) {
      return valor > 10 ? '#4caf50' : valor > 0 ? '#ff9800' : '#f44336';
    } else {
      return valor < 5 ? '#4caf50' : valor < 15 ? '#ff9800' : '#f44336';
    }
  }

  // Cargar reporte al montar
  import { onMount } from 'svelte';
  onMount(() => {
    loadReport();
  });
</script>

<h1 class="page-title">Reportes Mensuales</h1>

<section>
  <div class="report-container">
    <div class="report-header">
      <h2>Análisis de Desempeño</h2>
      <div class="button-group">
        <button onclick={loadReport} class="btn btn-primary">
          {isLoading ? 'Cargando...' : 'Generar Reporte'}
        </button>
        {#if reportData}
          <button onclick={exportToPDF} class="btn btn-success">
            📄 Exportar PDF
          </button>
          <button onclick={exportToCSV} class="btn btn-info">
            📊 Exportar CSV
          </button>
        {/if}
      </div>
    </div>

    {#if isLoading}
      <div class="loading">
        <p>Generando reporte...</p>
      </div>
    {:else if reportData}
      <div class="report-content">
        <!-- Métricas principales -->
        <div class="metrics-grid">
          <div class="metric-card">
            <h3>Ventas del Mes</h3>
            <p class="metric-value">${reportData.mesActual.ventasProductos.toLocaleString()}</p>
            <p class="metric-change" style="color: {getMetricaColor(reportData.porcentajeIncrementoVentas)}">
              {reportData.porcentajeIncrementoVentas > 0 ? '↑' : '↓'}
              {reportData.porcentajeIncrementoVentas.toFixed(2)}% vs mes anterior
            </p>
          </div>

          <div class="metric-card">
            <h3>Producción</h3>
            <p class="metric-value">{reportData.mesActual.fabricacionTotal}</p>
            <p class="metric-label">unidades fabricadas</p>
            <p class="metric-change" style="color: {getMetricaColor(reportData.porcentajeIncrementoFabricacion)}">
              {reportData.porcentajeIncrementoFabricacion > 0 ? '↑' : '↓'}
              {reportData.porcentajeIncrementoFabricacion.toFixed(2)}%
            </p>
          </div>

          <div class="metric-card">
            <h3>Horas Operarios</h3>
            <p class="metric-value">{reportData.mesActual.heurasOperarios}</p>
            <p class="metric-label">horas totales</p>
          </div>

          <div class="metric-card">
            <h3>Eficiencia Operativa</h3>
            <p class="metric-value" style="color: {getMetricaColor(reportData.eficienciaOperativa, false)}">
              {reportData.eficienciaOperativa.toFixed(2)}%
            </p>
            <p class="metric-label">rendimiento general</p>
          </div>
        </div>

        <!-- Indicadores de riesgo -->
        <div class="risk-section">
          <h3>Indicadores de Riesgo</h3>
          <div class="risk-grid">
            <div class="risk-card">
              <h4>Tasa de Ausentismo</h4>
              <div class="progress-bar">
                <div class="progress-fill" style="width: {Math.min(reportData.tasaAusentismo, 100)}%; background: {getMetricaColor(reportData.tasaAusentismo, false)};"></div>
              </div>
              <p>{reportData.tasaAusentismo.toFixed(2)}%</p>
              <span class="risk-badge {reportData.tasaAusentismo < 5 ? 'ok' : reportData.tasaAusentismo < 15 ? 'warning' : 'danger'}">
                {reportData.tasaAusentismo < 5 ? '✓ Óptimo' : reportData.tasaAusentismo < 15 ? '⚠ Alerta' : '✕ Crítico'}
              </span>
            </div>

            <div class="risk-card">
              <h4>Tasa de Defectos</h4>
              <div class="progress-bar">
                <div class="progress-fill" style="width: {Math.min(reportData.tasaDefectos, 100)}%; background: {getMetricaColor(reportData.tasaDefectos, false)};"></div>
              </div>
              <p>{reportData.tasaDefectos.toFixed(2)}%</p>
              <span class="risk-badge {reportData.tasaDefectos < 2 ? 'ok' : reportData.tasaDefectos < 5 ? 'warning' : 'danger'}">
                {reportData.tasaDefectos < 2 ? '✓ Óptimo' : reportData.tasaDefectos < 5 ? '⚠ Alerta' : '✕ Crítico'}
              </span>
            </div>

            <div class="risk-card">
              <h4>Mantenimientos Realizados</h4>
              <p class="metric-value">{reportData.mesActual.mantenimientos}</p>
              <p class="metric-label">tareas completadas</p>
            </div>
          </div>
        </div>

        <!-- Comparativa -->
        <div class="comparison-section">
          <h3>Comparativa Mensual</h3>
          <div class="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>Métrica</th>
                  <th>{reportData.mesActual.mes}</th>
                  <th>{reportData.mesPasado.mes}</th>
                  <th>Cambio</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Ventas</td>
                  <td>${reportData.mesActual.ventasProductos.toLocaleString()}</td>
                  <td>${reportData.mesPasado.ventasProductos.toLocaleString()}</td>
                  <td style="color: {getMetricaColor(reportData.porcentajeIncrementoVentas)}; font-weight: bold;">
                    {reportData.porcentajeIncrementoVentas > 0 ? '+' : ''}{reportData.porcentajeIncrementoVentas.toFixed(2)}%
                  </td>
                </tr>
                <tr>
                  <td>Producción</td>
                  <td>{reportData.mesActual.fabricacionTotal} u.</td>
                  <td>{reportData.mesPasado.fabricacionTotal} u.</td>
                  <td style="color: {getMetricaColor(reportData.porcentajeIncrementoFabricacion)}; font-weight: bold;">
                    {reportData.porcentajeIncrementoFabricacion > 0 ? '+' : ''}{reportData.porcentajeIncrementoFabricacion.toFixed(2)}%
                  </td>
                </tr>
                <tr>
                  <td>Defectos</td>
                  <td>{reportData.mesActual.defectosRegistrados}</td>
                  <td>{reportData.mesPasado.defectosRegistrados}</td>
                  <td style="color: {getMetricaColor(reportData.mesPasado.defectosRegistrados - reportData.mesActual.defectosRegistrados, false)}; font-weight: bold;">
                    {reportData.mesPasado.defectosRegistrados - reportData.mesActual.defectosRegistrados > 0 ? '↓' : '↑'} {Math.abs(reportData.mesPasado.defectosRegistrados - reportData.mesActual.defectosRegistrados)}
                  </td>
                </tr>
                <tr>
                  <td>Ausentismo</td>
                  <td>{reportData.mesActual.ausentismoTotal}</td>
                  <td>{reportData.mesPasado.ausentismoTotal}</td>
                  <td style="color: {getMetricaColor(reportData.mesPasado.ausentismoTotal - reportData.mesActual.ausentismoTotal, false)}; font-weight: bold;">
                    {reportData.mesPasado.ausentismoTotal - reportData.mesActual.ausentismoTotal > 0 ? '↓' : '↑'} {Math.abs(reportData.mesPasado.ausentismoTotal - reportData.mesActual.ausentismoTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <div class="volver-container">
    <button type="button" class="btn btn-outline-light btn-lg volver-btn" onclick={() => enrutador('/ruta_main')}>
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

  .report-container {
    width: 100%;
    max-width: 1400px;
    background: rgba(255, 255, 255, 0.07);
    border-radius: 1.5rem;
    padding: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.13);
    backdrop-filter: blur(12px);
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.18);
  }

  .report-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .report-header h2 {
    color: #76a9fa;
    font-size: 1.8rem;
    margin: 0;
  }

  .button-group {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
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

  .btn-success {
    background: linear-gradient(90deg, #4caf50 0%, #45a049 100%);
    color: #fff;
  }

  .btn-success:hover {
    transform: translateY(-2px);
  }

  .btn-info {
    background: linear-gradient(90deg, #2196f3 0%, #1976d2 100%);
    color: #fff;
  }

  .btn-info:hover {
    transform: translateY(-2px);
  }

  .loading {
    text-align: center;
    color: #76a9fa;
    padding: 2rem;
    font-size: 1.2rem;
  }

  .report-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .metric-card {
    background: rgba(118, 169, 250, 0.08);
    border: 1px solid rgba(118, 169, 250, 0.3);
    border-radius: 1rem;
    padding: 1.5rem;
    text-align: center;
    transition: all 0.3s;
  }

  .metric-card:hover {
    background: rgba(118, 169, 250, 0.12);
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(118, 169, 250, 0.2);
  }

  .metric-card h3 {
    color: #76a9fa;
    font-size: 1rem;
    margin: 0 0 0.8rem 0;
  }

  .metric-value {
    font-size: 2rem;
    font-weight: 700;
    color: #fff;
    margin: 0.5rem 0;
  }

  .metric-label {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
    margin: 0;
  }

  .metric-change {
    font-weight: 600;
    font-size: 1rem;
    margin-top: 0.5rem;
  }

  .risk-section {
    margin-top: 2rem;
  }

  .risk-section h3 {
    color: #76a9fa;
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
  }

  .risk-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .risk-card {
    background: rgba(244, 67, 54, 0.05);
    border: 1px solid rgba(244, 67, 54, 0.2);
    border-radius: 1rem;
    padding: 1.5rem;
  }

  .risk-card h4 {
    color: #fff;
    font-size: 1rem;
    margin: 0 0 1rem 0;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
    margin: 1rem 0;
  }

  .progress-fill {
    height: 100%;
    transition: width 0.3s;
  }

  .risk-card p {
    color: #fff;
    font-weight: 600;
    margin: 0.5rem 0;
  }

  .risk-badge {
    display: inline-block;
    padding: 0.4rem 0.8rem;
    border-radius: 0.5rem;
    font-size: 0.85rem;
    font-weight: 600;
    margin-top: 0.5rem;
  }

  .risk-badge.ok {
    background: rgba(76, 175, 80, 0.2);
    color: #4caf50;
  }

  .risk-badge.warning {
    background: rgba(255, 152, 0, 0.2);
    color: #ff9800;
  }

  .risk-badge.danger {
    background: rgba(244, 67, 54, 0.2);
    color: #f44336;
  }

  .comparison-section {
    margin-top: 2rem;
  }

  .comparison-section h3 {
    color: #76a9fa;
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
  }

  .comparison-table {
    overflow-x: auto;
    border-radius: 1rem;
    background: rgba(79, 131, 247, 0.05);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    color: #fff;
  }

  table thead {
    background: rgba(79, 131, 247, 0.13);
  }

  table th {
    padding: 1rem;
    text-align: left;
    color: #76a9fa;
    font-weight: 700;
    border-bottom: 1px solid rgba(118, 169, 250, 0.3);
  }

  table td {
    padding: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  table tbody tr:last-child td {
    border-bottom: none;
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

  .volver-btn {
    width: 100%;
    max-width: 420px;
    border-radius: 1.2rem;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  @media (max-width: 768px) {
    .report-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .metrics-grid {
      grid-template-columns: 1fr;
    }

    .risk-grid {
      grid-template-columns: 1fr;
    }

    .report-container {
      padding: 1rem;
    }
  }
</style>
