export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const endpoint =
    'https://script.google.com/macros/s/AKfycbzZmLqf420SfZVch164Uhpd2cU2jWrA-1nQwDoKoj2O3ow8C4W24NFVZZy__lf2pgrD/exec';

  try {
    const payload =
      typeof req.body === 'string'
        ? req.body
        : JSON.stringify(req.body || {});

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: payload,
      redirect: 'follow'
    });

    const body = await response.text();

    if (!response.ok) {
      console.error('Apps Script HTTP:', response.status, body);
      return res.status(502).json({
        error: 'Falha ao registrar a solicitação.'
      });
    }

    let retorno;

    try {
      retorno = JSON.parse(body);
    } catch (_) {
      console.error('Apps Script não retornou JSON:', body);
      return res.status(502).json({
        error: 'Falha ao registrar a solicitação.'
      });
    }

    if (
      retorno.ok !== true &&
      retorno.sucesso !== true
    ) {
      console.error('Apps Script retornou erro:', retorno);
      return res.status(502).json({
        error: 'Falha ao registrar a solicitação.'
      });
    }

    return res.status(200).json({
      ok: true,
      sucesso: true
    });

  } catch (error) {
    console.error('Erro no proxy Vercel:', error);

    return res.status(500).json({
      error: 'Falha ao registrar a solicitação.'
    });
  }
}
