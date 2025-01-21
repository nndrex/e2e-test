"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var sdk_node_1 = require("@opentelemetry/sdk-node");
var sdk_metrics_1 = require("@opentelemetry/sdk-metrics");
var resources_1 = require("@opentelemetry/resources");
var semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
var auto_instrumentations_node_1 = require("@opentelemetry/auto-instrumentations-node");
var sdk_logs_1 = require("@opentelemetry/sdk-logs");
var exporter_trace_otlp_http_1 = require("@opentelemetry/exporter-trace-otlp-http");
var exporter_metrics_otlp_http_1 = require("@opentelemetry/exporter-metrics-otlp-http");
var exporter_logs_otlp_http_1 = require("@opentelemetry/exporter-logs-otlp-http");
require('@dotenvx/dotenvx').config();
//diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
var generateCollectorOptions = function (otlpType) {
    var config = {
        url: "https://otlp-gateway-prod-us-east-0.grafana.net/otlp/v1/".concat(otlpType),
        headers: {
            "Authorization": process.env.GRAFANA_API_KEY,
        }
    };
    return config;
};
var sdk = new sdk_node_1.NodeSDK({
    resource: new resources_1.Resource((_a = {},
        _a[semantic_conventions_1.ATTR_SERVICE_NAME] = 'e2e-test',
        _a[semantic_conventions_1.ATTR_SERVICE_VERSION] = '0.1.4',
        _a)),
    traceExporter: new exporter_trace_otlp_http_1.OTLPTraceExporter(generateCollectorOptions('traces')),
    metricReader: new sdk_metrics_1.PeriodicExportingMetricReader({
        exporter: new exporter_metrics_otlp_http_1.OTLPMetricExporter(generateCollectorOptions('metrics')),
    }),
    logRecordProcessors: [new sdk_logs_1.SimpleLogRecordProcessor(new exporter_logs_otlp_http_1.OTLPLogExporter(generateCollectorOptions('logs')))],
    instrumentations: [(0, auto_instrumentations_node_1.getNodeAutoInstrumentations)()],
});
sdk.start();
//# sourceMappingURL=lambda-wrapper.js.map