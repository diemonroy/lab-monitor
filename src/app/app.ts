import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitorService } from './services/monitor';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  private monitorService = inject(MonitorService);

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // Inicializamos con valores por defecto
  datosActuales: any = { nevera1: 0, humedad1: 0 };
  historial: any[] = [];
  cargando = true;
  error = '';

  // Configuración de la Gráfica de Líneas
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Temperatura (°C)',
        fill: true,
        tension: 0.5,
        borderColor: 'rgb(59, 130, 246)', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.2)'
      },
      {
        data: [],
        label: 'Humedad (%)',
        fill: true,
        tension: 0.5,
        borderColor: 'rgb(16, 185, 129)', // green-500
        backgroundColor: 'rgba(16, 185, 129, 0.2)'
      }
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Histórico de Variaciones' }
    },
    scales: {
      y: {
        beginAtZero: false,
        suggestedMin: 0,
        suggestedMax: 10
      }
    }
  };

  public lineChartLegend = true;

  ngOnInit() {
    this.monitorService.getLecturas().subscribe({
      next: (data) => {
        this.cargando = false;
        console.log('Datos recibidos:', data);

        if (data) {
          this.datosActuales = data;
          this.procesarHistorial(data);
          this.actualizarGrafica(data);
        }
      },
      error: (err) => {
        this.cargando = false;
        this.error = 'Error de conexión con Firebase';
        console.error(err);
      }
    });
  }

  procesarHistorial(data: any) {
    const temp = data.nevera1;
    const hum = data.humedad1;

    const nuevaLectura = {
      hora: new Date(),
      temp: temp,
      hum: hum,
      estado: this.monitorService.validarRango(temp) ? 'Normal' : 'FUERA DE RANGO'
    };

    this.historial.unshift(nuevaLectura);

    if (this.historial.length > 10) {
      this.historial.pop();
    }
  }

  actualizarGrafica(data: any) {
    const ahora = new Date().toLocaleTimeString();
    
    // Agregar nueva etiqueta (Hora)
    this.lineChartData.labels?.push(ahora);
    
    // Agregar datos a los datasets
    this.lineChartData.datasets[0].data.push(data.nevera1);
    this.lineChartData.datasets[1].data.push(data.humedad1);

    // Mantener ventana de tiempo (últimos 20 puntos)
    if (this.lineChartData.labels && this.lineChartData.labels.length > 20) {
      this.lineChartData.labels.shift();
      this.lineChartData.datasets[0].data.shift();
      this.lineChartData.datasets[1].data.shift();
    }

    // Forzar redibujado de la gráfica
    this.chart?.update();
  }

  esTemperaturaSegura(temp: number): boolean {
    return this.monitorService.validarRango(temp);
  }
}