// src/utils/performanceMonitor.ts
class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  startMeasure(name: string) {
    performance.mark(`${name}-start`);
  }

  endMeasure(name: string) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name)[0];
    if (measure) {
      const currentMetrics = this.metrics.get(name) || [];
      currentMetrics.push(measure.duration);
      this.metrics.set(name, currentMetrics);
      
      // Mantener solo las últimas 10 mediciones
      if (currentMetrics.length > 10) {
        currentMetrics.shift();
      }
    }
  }

  getAverageTime(name: string): number {
    const times = this.metrics.get(name) || [];
    if (times.length === 0) return 0;
    
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }

  logPerformance() {
    console.group('🚀 Performance Metrics');
    this.metrics.forEach((times, name) => {
      const avg = this.getAverageTime(name);
      const last = times[times.length - 1] || 0;
      console.log(`${name}: ${last.toFixed(2)}ms (avg: ${avg.toFixed(2)}ms)`);
    });
    console.groupEnd();
  }

  clear() {
    this.metrics.clear();
    performance.clearMarks();
    performance.clearMeasures();
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Hacer disponible globalmente para debugging
(window as any).performance = {
  ...window.performance,
  monitor: performanceMonitor
};