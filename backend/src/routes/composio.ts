import { Router, Request, Response } from 'express';
import { Composio } from '@composio/core';

const router = Router();

const COMPOSIO_API_KEY = 'ac_FbEXO1bgyAY3';

interface CalendarEventParams {
  summary: string;
  startDate: string;
  endDate: string;
  description?: string;
}

interface SlackMessageParams {
  channel: string;
  message: string;
}

router.post('/calendar/create-event', async (req: Request, res: Response) => {
  try {
    const { summary, startDate, endDate, description } = req.body as CalendarEventParams;

    if (!summary || !startDate || !endDate) {
      return res.status(400).json({ error: 'summary, startDate e endDate são obrigatórios' });
    }

    const client = new Composio({ apiKey: COMPOSIO_API_KEY });

    const event = {
      summary,
      start: { dateTime: startDate, timeZone: 'America/Sao_Paulo' },
      end: { dateTime: endDate, timeZone: 'America/Sao_Paulo' },
      description: description || 'Lembrete de expiração do Autodesk Viewer',
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 1440 },
          { method: 'email', minutes: 1440 }
        ]
      }
    };

    const result = await client.google.calendar.createEvent({ entityId: 'me', eventData: event });

    res.json({ success: true, event: result });
  } catch (error) {
    console.error('Erro ao criar evento no Google Calendar:', error);
    res.status(500).json({ error: 'Erro ao criar evento no Google Calendar' });
  }
});

router.post('/slack/send-message', async (req: Request, res: Response) => {
  try {
    const { channel, message } = req.body as SlackMessageParams;

    if (!channel || !message) {
      return res.status(400).json({ error: 'channel e message são obrigatórios' });
    }

    const client = new Composio({ apiKey: COMPOSIO_API_KEY });

    const result = await client.slack.chat.postMessage({
      channel,
      text: message,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: message
          }
        }
      ]
    });

    res.json({ success: true, result });
  } catch (error) {
    console.error('Erro ao enviar mensagem no Slack:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagem no Slack' });
  }
});

router.post('/reminders/create', async (req: Request, res: Response) => {
  try {
    const { empreendimentoId, nome, dataExpiracao, tipo } = req.body;

    if (!empreendimentoId || !nome || !dataExpiracao || !tipo) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    const client = new Composio({ apiKey: COMPOSIO_API_KEY });
    const results = [];

    if (tipo === 'calendar' || tipo === 'both') {
      const dataExpiracaoDate = new Date(dataExpiracao);
      const startDate = new Date(dataExpiracaoDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      const endDateReminder = new Date(dataExpiracaoDate.getTime() - 24 * 60 * 60 * 1000);

      const event = {
        summary: `[URGENTE] Expiração: ${nome}`,
        start: { dateTime: startDate.toISOString(), timeZone: 'America/Sao_Paulo' },
        end: { dateTime: endDateReminder.toISOString(), timeZone: 'America/Sao_Paulo' },
        description: `O empreendimento "${nome}" expira em 7 dias!\n\nLink: https://autode.sk\n\nAção necessária: Acesse o Autodesk Viewer para estender o link.`,
        colorId: '11'
      };

      try {
        const calResult = await client.google.calendar.createEvent({
          entityId: 'me',
          eventData: event
        });
        results.push({ tipo: 'calendar', success: true, result: calResult });
      } catch (err) {
        results.push({ tipo: 'calendar', success: false, error: String(err) });
      }
    }

    if (tipo === 'slack' || tipo === 'both') {
      const slackMessage = `*ALERTA DE EXPIRAÇÃO*\n\nO empreendimento *${nome}* expira em breve!\n\n> Data de expiração: ${new Date(dataExpiracao).toLocaleDateString('pt-BR')}\n> Ação necessária: Acesse o Autodesk Viewer para estender o link.\n\ncc @arthur.sergio`;

      try {
        const slackResult = await client.slack.chat.postMessage({
          channel: '#alertas-empreendimentos',
          text: slackMessage,
          blocks: [
            {
              type: 'header',
              text: { type: 'plain_text', text: 'Alerta de Expiração' }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: slackMessage
              }
            },
            {
              type: 'actions',
              elements: [
                {
                  type: 'button',
                  text: { type: 'plain_text', text: 'Abrir Autodesk Viewer' },
                  url: 'https://viewer.autodesk.com/designviews'
                }
              ]
            }
          ]
        });
        results.push({ tipo: 'slack', success: true, result: slackResult });
      } catch (err) {
        results.push({ tipo: 'slack', success: false, error: String(err) });
      }
    }

    res.json({ success: true, results });
  } catch (error) {
    console.error('Erro ao criar lembretes:', error);
    res.status(500).json({ error: 'Erro ao criar lembretes' });
  }
});

export { router as composioRouter };