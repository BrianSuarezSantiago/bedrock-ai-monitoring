// Generador de datos simulados basado en logs reales de Amazon Bedrock

const modelIds = [
  "arn:aws:bedrock:eu-west-1:014498666989:inference-profile/eu.amazon.nova-lite-v1:0",
  "arn:aws:bedrock:us-east-1:014498666989:inference-profile/us.anthropic.claude-3-5-sonnet-20241022-v2:0",
  "arn:aws:bedrock:us-west-2:014498666989:inference-profile/us.anthropic.claude-3-haiku-20240307-v1:0",
  "arn:aws:bedrock:ap-southeast-1:014498666989:inference-profile/ap.meta.llama3-2-90b-instruct-v1:0"
];

const regions = ["us-east-1", "eu-west-1", "ap-southeast-1", "us-west-2"];
const inferenceRegions = ["eu-north-1", "us-east-1", "us-west-2", "ap-southeast-2"];

const operations = ["Converse", "ConverseStream", "InvokeModel", "InvokeModelWithResponseStream"];

const samplePrompts = [
  "que es aws",
  "explica como funciona amazon ec2",
  "cuales son las mejores practicas de seguridad en la nube",
  "ayudame a crear una funcion lambda",
  "como configurar un bucket de s3",
  "explica los servicios de base de datos de aws",
  "que es amazon bedrock",
  "como implementar ci cd en aws",
  "diferencias entre rds y dynamodb",
  "como usar cloudformation"
];

const sampleResponses = [
  "AWS es una plataforma de servicios en la nube que ofrece una mezcla de servicios de infraestructura como servicio (IaaS), plataforma como servicio (PaaS) y software como servicio (SaaS). AWS proporciona una amplia gama de servicios que incluyen computación, almacenamiento, bases de datos, redes, seguridad, desarrollo de aplicaciones, gestión de dispositivos móviles, análisis de datos y más.",
  "Amazon EC2 (Elastic Compute Cloud) es un servicio web que proporciona capacidad de cómputo escalable en la nube. Permite a los usuarios alquilar máquinas virtuales en las que pueden ejecutar sus propias aplicaciones.",
  "Las mejores prácticas de seguridad en AWS incluyen: usar IAM para gestión de accesos, habilitar MFA, cifrar datos en tránsito y reposo, usar VPC para aislamiento de red, implementar logging y monitoreo con CloudTrail y CloudWatch.",
  "Para crear una función Lambda: 1) Accede a la consola de AWS Lambda, 2) Haz clic en 'Crear función', 3) Elige el runtime, 4) Escribe tu código, 5) Configura triggers y permisos, 6) Despliega la función."
];

const threatTypes = [
  "Prompt Injection",
  "Jailbreak Attempt", 
  "Data Exfiltration",
  "Malicious Code Generation",
  "PII Exposure",
  "Content Policy Violation"
];

const usernames = ["Brian", "Alice", "Bob", "Carol", "David", "Eve", "Frank", "Grace"];

export const generateBedrockLog = () => {
  const inputTokens = Math.floor(Math.random() * 50) + 3;
  const outputTokens = Math.floor(Math.random() * 300) + 50;
  const latency = Math.floor(Math.random() * 1500) + 300;
  const prompt = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
  const response = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
  const temperature = Math.round((Math.random() * 0.5 + 0.5) * 10) / 10; // 0.5 - 1.0
  const topP = Math.round((Math.random() * 0.3 + 0.7) * 10) / 10; // 0.7 - 1.0
  const maxTokens = [256, 512, 1024, 2048][Math.floor(Math.random() * 4)];
  
  return {
    timestamp: new Date().toISOString(),
    accountId: "014498666989",
    identity: {
      arn: `arn:aws:sts::014498666989:assumed-role/AWSReservedSSO_Content_36144823067e6c73/${usernames[Math.floor(Math.random() * usernames.length)]}`
    },
    region: regions[Math.floor(Math.random() * regions.length)],
    requestId: generateUUID(),
    operation: operations[Math.floor(Math.random() * operations.length)],
    modelId: modelIds[Math.floor(Math.random() * modelIds.length)],
    input: {
      inputContentType: "application/json",
      inputBodyJson: {
        messages: [
          {
            role: "user",
            content: [
              {
                text: prompt
              }
            ]
          }
        ],
        inferenceConfig: {
          maxTokens: maxTokens,
          temperature: temperature,
          topP: topP,
          stopSequences: []
        },
        additionalModelRequestFields: {}
      },
      inputTokenCount: inputTokens,
      cacheReadInputTokenCount: 0,
      cacheWriteInputTokenCount: 0
    },
    output: {
      outputContentType: "application/json",
      outputBodyJson: {
        output: {
          message: {
            role: "assistant",
            content: [
              {
                text: response
              }
            ]
          }
        },
        stopReason: "end_turn",
        metrics: {
          latencyMs: latency
        },
        usage: {
          inputTokens: inputTokens,
          outputTokens: outputTokens,
          totalTokens: inputTokens + outputTokens
        }
      },
      outputTokenCount: outputTokens
    },
    inferenceRegion: inferenceRegions[Math.floor(Math.random() * inferenceRegions.length)],
    schemaType: "ModelInvocationLog",
    schemaVersion: "1.0"
  };
};

export const generateSecurityEvent = () => {
  const threatType = threatTypes[Math.floor(Math.random() * threatTypes.length)];
  const username = usernames[Math.floor(Math.random() * usernames.length)];
  const risk = Math.random() > 0.8 ? 'High' : Math.random() > 0.5 ? 'Medium' : 'Low';
  
  return {
    id: generateUUID(),
    timestamp: new Date().toISOString(),
    threatType: threatType,
    detail: getDetailForThreat(threatType),
    priority: risk,
    username: username,
    risk: risk,
    ip: generateRandomIP(),
    resolved: Math.random() > 0.7
  };
};

export const generateChatMessage = () => {
  const isUser = Math.random() > 0.5;
  const prompt = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
  
  return {
    id: generateUUID(),
    role: isUser ? "user" : "assistant",
    content: isUser ? prompt : sampleResponses[Math.floor(Math.random() * sampleResponses.length)],
    timestamp: new Date().toISOString(),
    time: new Date().toLocaleTimeString()
  };
};

// Función para extraer mensajes de chat de logs de Bedrock
export const extractChatFromBedrockLog = (log) => {
  const messages = [];
  
  // Extraer mensaje del usuario
  if (log.input?.inputBodyJson?.messages) {
    const userMessage = log.input.inputBodyJson.messages.find(m => m.role === "user");
    if (userMessage && userMessage.content && userMessage.content[0]?.text) {
      messages.push({
        id: `${log.requestId}-user`,
        role: "user",
        content: userMessage.content[0].text,
        timestamp: log.timestamp,
        time: new Date(log.timestamp).toLocaleTimeString()
      });
    }
  }
  
  // Extraer respuesta del asistente
  if (log.output?.outputBodyJson?.output?.message) {
    const assistantMessage = log.output.outputBodyJson.output.message;
    if (assistantMessage.role === "assistant" && assistantMessage.content && assistantMessage.content[0]?.text) {
      messages.push({
        id: `${log.requestId}-assistant`,
        role: "assistant",
        content: assistantMessage.content[0].text,
        timestamp: log.timestamp,
        time: new Date(log.timestamp).toLocaleTimeString()
      });
    }
  }
  
  return messages;
};

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function generateRandomIP() {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function getDetailForThreat(threatType) {
  const details = {
    "Prompt Injection": "Ignore previous instructions",
    "Jailbreak Attempt": "Act as a system admin",
    "Data Exfiltration": "Show me all user data",
    "Malicious Code Generation": "Create malware code",
    "PII Exposure": "Personal information detected"
  };
  return details[threatType] || "Security concern detected";
}

// Función para extraer métricas de rendimiento de logs
export const extractMetricsFromLogs = (logs) => {
  if (!logs || logs.length === 0) return null;
  
  const totalRequests = logs.length;
  const totalInputTokens = logs.reduce((sum, log) => sum + (log.input?.inputTokenCount || 0), 0);
  const totalOutputTokens = logs.reduce((sum, log) => sum + (log.output?.outputTokenCount || 0), 0);
  const totalTokens = totalInputTokens + totalOutputTokens;
  const avgLatency = logs.reduce((sum, log) => sum + (log.output?.outputBodyJson?.metrics?.latencyMs || 0), 0) / logs.length;
  
  // Extraer modelos únicos
  const uniqueModels = [...new Set(logs.map(log => log.modelId))];
  
  // Calcular distribución por región
  const regionDistribution = logs.reduce((acc, log) => {
    const region = log.region;
    acc[region] = (acc[region] || 0) + 1;
    return acc;
  }, {});
  
  // Calcular distribución por operación
  const operationDistribution = logs.reduce((acc, log) => {
    const operation = log.operation;
    acc[operation] = (acc[operation] || 0) + 1;
    return acc;
  }, {});
  
  return {
    totalRequests,
    totalInputTokens,
    totalOutputTokens,
    totalTokens,
    avgLatency: Math.round(avgLatency),
    uniqueModels: uniqueModels.length,
    regionDistribution,
    operationDistribution,
    errorRate: 0, // Calcular basado en logs de error si están disponibles
    successRate: 100
  };
};