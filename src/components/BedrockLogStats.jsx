import React from 'react';
import {
  Container,
  Header,
  ColumnLayout,
  Box,
  ProgressBar,
  StatusIndicator,
  Table
} from '@cloudscape-design/components';

const BedrockLogStats = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return (
      <Container header={<Header variant="h2">Bedrock Statistics</Header>}>
        <Box textAlign="center" color="text-status-inactive">
          No data available
        </Box>
      </Container>
    );
  }

  // Calcular estadísticas por modelo
  const modelStats = logs.reduce((acc, log) => {
    const modelName = log.modelId?.split('/').pop()?.split(':')[0] || 'Unknown';
    if (!acc[modelName]) {
      acc[modelName] = {
        requests: 0,
        totalTokens: 0,
        totalLatency: 0,
        inputTokens: 0,
        outputTokens: 0
      };
    }
    acc[modelName].requests += 1;
    acc[modelName].totalTokens += (log.output?.outputBodyJson?.usage?.totalTokens || 0);
    acc[modelName].totalLatency += (log.output?.outputBodyJson?.metrics?.latencyMs || 0);
    acc[modelName].inputTokens += (log.input?.inputTokenCount || 0);
    acc[modelName].outputTokens += (log.output?.outputTokenCount || 0);
    return acc;
  }, {});

  // Convertir a array para la tabla
  const modelStatsArray = Object.entries(modelStats).map(([model, stats]) => ({
    model,
    requests: stats.requests,
    totalTokens: stats.totalTokens,
    avgLatency: Math.round(stats.totalLatency / stats.requests),
    inputTokens: stats.inputTokens,
    outputTokens: stats.outputTokens,
    avgTokensPerRequest: Math.round(stats.totalTokens / stats.requests)
  }));

  // Estadísticas por región
  const regionStats = logs.reduce((acc, log) => {
    const region = log.region;
    acc[region] = (acc[region] || 0) + 1;
    return acc;
  }, {});

  // Estadísticas por operación
  const operationStats = logs.reduce((acc, log) => {
    const operation = log.operation;
    acc[operation] = (acc[operation] || 0) + 1;
    return acc;
  }, {});

  return (
    <Container header={<Header variant="h2">Bedrock Statistics</Header>}>
      <ColumnLayout columns={2}>
        {/* Estadísticas por Modelo */}
        <div>
          <Header variant="h3">Model Performance</Header>
          <Table
            columnDefinitions={[
              {
                id: "model",
                header: "Model",
                cell: item => item.model,
                width: 200
              },
              {
                id: "requests",
                header: "Requests",
                cell: item => item.requests
              },
              {
                id: "avgLatency",
                header: "Avg Latency (ms)",
                cell: item => item.avgLatency
              },
              {
                id: "avgTokens",
                header: "Avg Tokens",
                cell: item => item.avgTokensPerRequest
              }
            ]}
            items={modelStatsArray}
            variant="embedded"
            empty={
              <Box textAlign="center" color="inherit">
                No model data available
              </Box>
            }
          />
        </div>

        {/* Distribución por Región y Operación */}
        <div>
          <Header variant="h3">Distribution</Header>
          <ColumnLayout columns={1}>
            <div>
              <Box variant="awsui-key-label">Regions</Box>
              {Object.entries(regionStats).map(([region, count]) => (
                <Box key={region} margin={{ bottom: "xs" }}>
                  <Box display="flex" justifyContent="space-between">
                    <span>{region}</span>
                    <span>{count} requests</span>
                  </Box>
                  <ProgressBar
                    value={(count / logs.length) * 100}
                    additionalInfo={`${Math.round((count / logs.length) * 100)}%`}
                  />
                </Box>
              ))}
            </div>
            
            <div>
              <Box variant="awsui-key-label">Operations</Box>
              {Object.entries(operationStats).map(([operation, count]) => (
                <Box key={operation} margin={{ bottom: "xs" }}>
                  <Box display="flex" justifyContent="space-between">
                    <span>{operation}</span>
                    <span>{count} requests</span>
                  </Box>
                  <ProgressBar
                    value={(count / logs.length) * 100}
                    additionalInfo={`${Math.round((count / logs.length) * 100)}%`}
                  />
                </Box>
              ))}
            </div>
          </ColumnLayout>
        </div>
      </ColumnLayout>
    </Container>
  );
};

export default BedrockLogStats;