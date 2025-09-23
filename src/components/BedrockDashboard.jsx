import React, { useState, useEffect } from 'react';
import {
  AppLayout,
  Container,
  Header,
  Grid,
  Box,
  SpaceBetween,
  ColumnLayout,
  KeyValuePairs,
  ProgressBar,
  PieChart,
  Table,
  Badge,
  Button,
  StatusIndicator
} from '@cloudscape-design/components';
import { generateBedrockLog, generateSecurityEvent, generateChatMessage, extractChatFromBedrockLog, extractMetricsFromLogs } from '../utils/mockDataGenerator';

const BedrockDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [securityEvents, setSecurityEvents] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  // Simular datos en tiempo real basados en logs reales de Bedrock
  useEffect(() => {
    // Generar datos iniciales
    const initialLogs = Array.from({ length: 15 }, () => generateBedrockLog());
    const initialEvents = Array.from({ length: 3 }, () => generateSecurityEvent());
    
    // Extraer mensajes de chat de los logs
    const initialChat = initialLogs.flatMap(log => extractChatFromBedrockLog(log));
    
    setLogs(initialLogs);
    setSecurityEvents(initialEvents);
    setChatMessages(initialChat);

    // Simular actualizaciones en tiempo real
    const interval = setInterval(() => {
      // Agregar nuevo log cada 3-8 segundos
      if (Math.random() > 0.2) {
        const newLog = generateBedrockLog();
        setLogs(prev => [newLog, ...prev.slice(0, 99)]);
        
        // Extraer chat del nuevo log
        const newChatMessages = extractChatFromBedrockLog(newLog);
        if (newChatMessages.length > 0) {
          setChatMessages(prev => [...newChatMessages, ...prev.slice(0, 49)]);
        }
      }
      
      // Agregar evento de seguridad ocasionalmente (más realista - menos frecuente)
      if (Math.random() > 0.95) {
        setSecurityEvents(prev => [generateSecurityEvent(), ...prev.slice(0, 29)]);
      }
    }, Math.random() * 5000 + 3000); // Entre 3-8 segundos

    return () => clearInterval(interval);
  }, []);

  // Calcular métricas del dashboard basadas en logs reales
  const metrics = extractMetricsFromLogs(logs);
  const latestLog = logs[0]; // Log más reciente para mostrar información del modelo

  // Datos para gráficos
  const threatLevelData = [
    { title: "Low", value: 65, color: "#1f77b4" },
    { title: "Medium", value: 25, color: "#ff7f0e" },
    { title: "High", value: 10, color: "#d62728" }
  ];

  const securityStatsData = [
    { title: "Passed", value: 7, color: "#2ca02c" },
    { title: "Failed", value: 0, color: "#d62728" }
  ];

  const guardrailCategoriesData = [
    { title: "PROMPTS", value: 5, color: "#1f77b4" },
    { title: "Violence", value: 2, color: "#ff7f0e" },
    { title: "Hate", value: 1, color: "#d62728" }
  ];

  return (
    <AppLayout
      navigationHide
      toolsHide
      content={
        <SpaceBetween size="l">
          {/* Header */}
          <Container>
            <Header 
              variant="h1"
              actions={
                <StatusIndicator type="success">
                  Live • {logs.length} requests monitored
                </StatusIndicator>
              }
            >
              Real-Time GenAI Security Monitoring
            </Header>
          </Container>

          {/* Model Information */}
          <Container header={<Header variant="h2">Model Information</Header>}>
            <ColumnLayout columns={4} variant="text-grid">
              <div>
                <Box variant="awsui-key-label">Application Type</Box>
                <div>Chatbot</div>
              </div>
              <div>
                <Box variant="awsui-key-label">LLM Family</Box>
                <div>Claude 3.5 Sonnet</div>
              </div>
              <div>
                <Box variant="awsui-key-label">Model ID</Box>
                <div>anthropic.claude-3-5-sonnet-20241022-v2:0</div>
              </div>
              <div>
                <Box variant="awsui-key-label">Guardrail Name</Box>
                <div>genai-dashboard</div>
              </div>
              <div>
                <Box variant="awsui-key-label">Guardrails</Box>
                <div>ON</div>
              </div>
              <div>
                <Box variant="awsui-key-label">Live Tokens</Box>
                <div>{totalTokens.toLocaleString()}</div>
              </div>
            </ColumnLayout>
          </Container>

          {/* Metrics Grid */}
          <Grid
            gridDefinition={[
              { colspan: { default: 12, s: 6, m: 4 } },
              { colspan: { default: 12, s: 6, m: 4 } },
              { colspan: { default: 12, s: 6, m: 4 } }
            ]}
          >
            {/* Overall Threat Level */}
            <Container header={<Header variant="h2">Overall Threat Level</Header>}>
              <Box textAlign="center">
                <PieChart
                  data={threatLevelData}
                  size="medium"
                  hideFilter
                  hideLegend
                  innerMetricDescription="Threat Level"
                  innerMetricValue="Low"
                />
                <Box margin={{ top: "s" }} fontSize="body-s" color="text-status-info">
                  All clear. Your application is secure.
                </Box>
              </Box>
            </Container>

            {/* Security Stats */}
            <Container header={<Header variant="h2">Security Stats</Header>}>
              <Box textAlign="center">
                <PieChart
                  data={securityStatsData}
                  size="medium"
                  hideFilter
                  hideLegend
                  innerMetricDescription="Total"
                  innerMetricValue="7"
                />
                <Box margin={{ top: "s" }}>
                  <ColumnLayout columns={2} variant="text-grid">
                    <div>
                      <Box variant="awsui-key-label">Prompt Injection: 0.0%</Box>
                      <Box variant="awsui-key-label">Jailbreak Attempts: 0.0%</Box>
                    </div>
                    <div>
                      <Box variant="awsui-key-label">Malware: 0.0%</Box>
                      <Box variant="awsui-key-label">Network Anomaly: 0.0%</Box>
                    </div>
                  </ColumnLayout>
                </Box>
              </Box>
            </Container>

            {/* Guardrail Categories */}
            <Container header={<Header variant="h2">Guardrail Categories</Header>}>
              <Box textAlign="center">
                <PieChart
                  data={guardrailCategoriesData}
                  size="medium"
                  hideFilter
                  hideLegend
                  innerMetricDescription="Total"
                  innerMetricValue="8"
                />
              </Box>
            </Container>
          </Grid>

          {/* Bottom Grid */}
          <Grid
            gridDefinition={[
              { colspan: { default: 12, m: 6 } },
              { colspan: { default: 12, m: 6 } }
            ]}
          >
            {/* Recent Chat */}
            <Container header={<Header variant="h2">Recent Chat</Header>}>
              <SpaceBetween size="s">
                {chatMessages.slice(0, 6).map((message, index) => (
                  <Box 
                    key={message.id || index} 
                    padding="s" 
                    backgroundColor={message.role === 'user' ? 'background-container-content' : 'background-container-header'}
                  >
                    <Box fontSize="body-s" color="text-label">
                      {message.role === 'user' ? 'User: ' : 'Assistant: '}{message.content}
                    </Box>
                    <Box fontSize="body-s" color="text-status-inactive">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </Box>
                  </Box>
                ))}
                {chatMessages.length === 0 && (
                  <Box textAlign="center" color="text-status-inactive">
                    No recent chat messages
                  </Box>
                )}
              </SpaceBetween>
            </Container>

            {/* Security Events */}
            <Container header={<Header variant="h2">Security Events</Header>}>
              <Table
                columnDefinitions={[
                  {
                    id: "threatType",
                    header: "Threat Type",
                    cell: item => item.threatType
                  },
                  {
                    id: "detail",
                    header: "Detail",
                    cell: item => item.detail
                  },
                  {
                    id: "priority",
                    header: "Priority",
                    cell: item => item.priority
                  },
                  {
                    id: "username",
                    header: "Username",
                    cell: item => item.username
                  },
                  {
                    id: "risk",
                    header: "Risk",
                    cell: item => <Badge color={item.risk === 'Low' ? 'green' : 'red'}>{item.risk}</Badge>
                  }
                ]}
                items={securityEvents.slice(0, 10)}
                variant="embedded"
                empty={
                  <Box textAlign="center" color="inherit">
                    <b>No security events</b>
                    <Box padding={{ bottom: "s" }} variant="p" color="inherit">
                      No security events to display.
                    </Box>
                  </Box>
                }
              />
            </Container>
          </Grid>
        </SpaceBetween>
      }
    />
  );
};

export default BedrockDashboard;