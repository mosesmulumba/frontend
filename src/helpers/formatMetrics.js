const translateTimestamp = (timestamp) => {
    const timestampMillisecond = timestamp * 1000; // convert timestamp to milliseconds
    const dateObject = new Date(timestampMillisecond); // create a date object out of milliseconds
    return dateObject.toLocaleString();
}

const bytesToMegabytes = (bytes) => {
    return bytes / 1000000;
}

export const getCurrentTimeStamp = () => {
  return new Date().getTime() / 1000;
}

// this function gets the 'end' timestamp
export const subtractTime = (endTimestamp, days) => {
  return new Date(endTimestamp - (days * 24 * 60 * 60)).getTime();
}

export const formatMemoryMetrics = (projectID, memoryMetrics) => {
    const found = memoryMetrics.find((metric) => metric.project === projectID);
    const memoryData = [];

    if (found !== undefined) {
      if (found.metrics.length > 0) {
        found.metrics.forEach((metric) => {
          const newMetricObject = {
            time: translateTimestamp(metric.timestamp),
            memory: bytesToMegabytes(metric.value)
          };

          memoryData.push(newMetricObject);
        });
      } else {
        memoryData.push({ time: 0, memory: 0 });
        memoryData.push({ time: 0, memory: 0 });
      }
    }
    return memoryData;
}

export const formatCPUMetrics = (projectID, cpuMetrics) => {
    const found = cpuMetrics.find((metric) => metric.project === projectID);
    const cpuData = [];

    if (found !== undefined) {
      if (found.metrics.length > 0) {
        found.metrics.forEach((metric) => {
          const newMetricObject = {
            time: translateTimestamp(metric.timestamp),
            cpu: metric.value * 10
          };

          cpuData.push(newMetricObject);
        });
      } else {
        cpuData.push({ time: 0, cpu: 0 });
        cpuData.push({ time: 0, cpu: 0 });
      }
    }
    return cpuData;
}

export const formatNetworkMetrics = (projectID, networkMetrics) => {
    const found = networkMetrics.find((metric) => metric.project === projectID);
    const networkData = [];

    if (found !== undefined) {
      if (found.metrics.length > 0) {
        found.metrics.forEach((metric) => {
          const newMetricObject = {
            time: translateTimestamp(metric.timestamp),
            network: metric.value
          };

          networkData.push(newMetricObject);
        });
      } else {
        networkData.push({ time: 0, network: 0 });
        networkData.push({ time: 0, network: 0 });
      }
    }
    return networkData;
}

export const formatAppMemoryMetrics = (appID, memoryMetrics) => {
  const found = memoryMetrics.find((metric) => metric.app === appID);
  const memoryData = [];

  if (found !== undefined) {
    if (found.metrics.length > 0) {
      found.metrics.forEach((metric) => {
        const newMetricObject = {
          time: translateTimestamp(metric.timestamp),
          memory: bytesToMegabytes(metric.value)
        };

        memoryData.push(newMetricObject);
      });
    } else {
      memoryData.push({ time: 0, memory: 0 });
      memoryData.push({ time: 0, memory: 0 });
    }
  }
  return memoryData;
}

export const formatAppCPUMetrics = (appID, cpuMetrics) => {
  const found = cpuMetrics.find((metric) => metric.app === appID);
  const cpuData = [];

  if (found !== undefined) {
    if (found.metrics.length > 0) {
      found.metrics.forEach((metric) => {
        const newMetricObject = {
          time: translateTimestamp(metric.timestamp),
          cpu: metric.value * 10
        };

        cpuData.push(newMetricObject);
      });
    } else {
      cpuData.push({ time: 0, cpu: 0 });
      cpuData.push({ time: 0, cpu: 0 });
    }
  }
  return cpuData;
}

export const formatAppNetworkMetrics = (appID, networkMetrics) => {
  const found = networkMetrics.find((metric) => metric.app === appID);
  const networkData = [];

  if (found !== undefined) {
    if (found.metrics.length > 0) {
      found.metrics.forEach((metric) => {
        const newMetricObject = {
          time: translateTimestamp(metric.timestamp),
          network: metric.value
        };

        networkData.push(newMetricObject);
      });
    } else {
      networkData.push({ time: 0, network: 0 });
      networkData.push({ time: 0, network: 0 });
    }
  }
  return networkData;
}