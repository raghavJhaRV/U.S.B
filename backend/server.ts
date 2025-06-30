import express from 'express';
import { Request, Response } from 'express';
import * as exportRegistrations from './api/admin/exportRegistrations';
import * as payments from './api/payments';
import * as stats from './api/stats';
import * as teams from './api/teams';
import * as programs from './api/programs';
import * as register from './api/register';
import * as registrations from './api/registrations';
import * as events from './api/events';
import fetch from 'node-fetch';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.get('/api/teams', teams.GET);
app.get('/api/programs', programs.GET);
app.get('/api/registrations', registrations.GET);
app.get('/api/stats', (req, res, next) => {
  Promise.resolve(stats.GET(req, res)).catch(next);
});
app.get('/api/payments', async (req, res, next) => {
  try {
    const fetchRequest = new Request(`http://localhost:3000${req.url}`, {
      method: req.method,
      headers: req.headers as any,
    });
    const response = await payments.GET(fetchRequest);
    res.status(response.status).set(Object.fromEntries(response.headers)).send(await response.text());
  } catch (err) {
    next(err);
  }
});
app.get('/api/admin/exportRegistrations', async (req, res, next) => {
  try {
    const response = await exportRegistrations.GET();
    res
      .status(response.status)
      .set(Object.fromEntries(response.headers))
      .send(await response.text());
  } catch (err) {
    next(err);
  }
});
app.get('/api/events', async (req, res, next) => {
  try {
    const { teamId } = req.query;

    const events = await prisma.event.findMany({
      where: teamId ? { teamId: String(teamId) } : undefined,
      orderBy: { date: 'asc' },
      include: { team: true },
    });

    res.json(events);
  } catch (err) {
    next(err);
  }
});



app.post('/api/register', (req, res, next) => {
  Promise.resolve(register.POST(req, res)).catch(next);
});
app.post('/api/teams', (req, res, next) => {
  Promise.resolve(teams.POST(req, res)).catch(next);
});
app.post('/api/programs', (req, res, next) => {
  Promise.resolve(programs.POST(req, res)).catch(next);
});
app.post('/api/payments', (req, res, next) => {
  Promise.resolve(payments.POST(req, res)).catch(next);
});


app.route('/api/events')
  .get(async (req, res, next) => {
    const fetchRequest = new Request(`http://localhost:3000${req.url}`, {
      method: req.method,
      headers: req.headers as any,
    });
    const response = await events.GET(fetchRequest);
    res.status(response.status).set(Object.fromEntries(response.headers)).send(await response.text());
  })
  .post((req, res, next) => {
    Promise.resolve(events.POST(req as any)).then(async response => {
      res.status(response.status).set(Object.fromEntries(response.headers)).send(await response.text());
    }).catch(next);
  })
  .delete((req, res, next) => {
    Promise.resolve(events.DELETE(req as any)).then(async response => {
      res.status(response.status).set(Object.fromEntries(response.headers)).send(await response.text());
    }).catch(next);
  });


app.delete('/api/teams/:id', (req, res, next) => {
  Promise.resolve(teams.DELETE(req, res)).catch(next);
});
app.delete('/api/programs/:id', (req, res, next) => {
  Promise.resolve(programs.DELETE(req, res)).catch(next);
});
app.delete('/api/registrations/:id', (req, res, next) => {
  Promise.resolve(registrations.DELETE(req, res)).catch(next);
});


app.listen(3000, () => {
  console.log('✅ Backend running on http://localhost:3000');
});

