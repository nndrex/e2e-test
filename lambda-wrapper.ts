import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { PeriodicExportingMetricReader, ConsoleMetricExporter } from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { SimpleLogRecordProcessor, ConsoleLogRecordExporter } from '@opentelemetry/sdk-logs';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

require('@dotenvx/dotenvx').config()
//diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const generateCollectorOptions:any = (otlpType) => {
  const config = {
    url: `https://otlp-gateway-prod-us-east-0.grafana.net/otlp/v1/${otlpType}`,
    headers: {
      "Authorization":process.env.GRAFANA_API_KEY,
    }
}
  return config;
};

const sdk = new NodeSDK({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: 'e2e-test',
    [ATTR_SERVICE_VERSION]: '0.1.4',
  }),
  traceExporter: new OTLPTraceExporter(generateCollectorOptions('traces')),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter(generateCollectorOptions('metrics')),
  }),
  logRecordProcessors: [new SimpleLogRecordProcessor(new OTLPLogExporter(generateCollectorOptions('logs')))],
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
