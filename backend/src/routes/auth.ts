import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';

const router = Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const ALLOWED_DOMAIN = 'seazone.com.br';

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token é obrigatório' });
    }

    if (!GOOGLE_CLIENT_ID) {
      console.error('GOOGLE_CLIENT_ID não configurado');
      return res.status(500).json({ error: 'Configuração de autenticação incompleta' });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    const email = payload.email || '';
    const domain = email.split('@')[1];

    if (domain !== ALLOWED_DOMAIN) {
      return res.status(403).json({ error: `Apenas emails @${ALLOWED_DOMAIN} são permitidos` });
    }

    res.json({
      success: true,
      user: {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      }
    });
  } catch (error) {
    console.error('Erro na verificação do token Google:', error);
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
});

router.get('/google/config', (req, res) => {
  res.json({
    clientId: GOOGLE_CLIENT_ID,
    allowedDomain: ALLOWED_DOMAIN,
  });
});

export const authRouter = router;