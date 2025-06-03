import { pool } from "../database/db.js";

const horariosPadrao = {
    segunda: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
    terca: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
    quarta: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
    quinta: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
    sexta: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
    sabado: ['09:00', '10:00', '11:00', '12:00'],
    domingo: []
};

const calcularDuracaoTotal = async (ids_servicos) => {
  const result = await pool.query(
    `SELECT SUM(duracao_em_horas) as total FROM barber.servicos WHERE id = ANY($1::int[])`,
    [ids_servicos]
  );
  return parseInt(result.rows[0].total) || 0;
};

const calcularHoraFim = (hora_inicio, duracaoEmHoras) => {
  const [hora, minuto] = hora_inicio.split(":").map(Number);
  const fim = new Date(0, 0, 0, hora + duracaoEmHoras, minuto);
  const h = fim.getHours().toString().padStart(2, "0");
  const m = fim.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
};

const criarAgendamento = async (id_usuario, id_barbeiro, data, hora_inicio, hora_fim, ids_servicos) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const agendamento = await client.query(
      `INSERT INTO barber.agendamentos (id_usuario, id_barbeiro, data, hora_inicio, hora_fim)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id_usuario, id_barbeiro, data, hora_inicio, hora_fim]
    );

    const agendamentoId = agendamento.rows[0].id;

    for (const idServico of ids_servicos) {
      await client.query(
        `INSERT INTO barber.agendamento_servicos (id_agendamento, id_servico)
         VALUES ($1, $2)`,
        [agendamentoId, idServico]
      );
    }

    await client.query("COMMIT");
    return agendamento.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};


const buscarHorariosDisponiveis = async (id_barbeiro, data) => {
  const diaSemana = new Date(data).toLocaleDateString("pt-BR", { weekday: 'long' })
  .normalize("NFD").replace(/[\u0300-\u036f]/g, '') 
  .toLowerCase().replace("-feira", ""); 


  const disponiveis = horariosPadrao[diaSemana] || [];

  if (disponiveis.length === 0) return []; // folga

  const agResult = await pool.query(
    `SELECT hora_inicio FROM barber.agendamentos
     WHERE id_barbeiro = $1 AND data = $2`,
    [id_barbeiro, data]
  );

  const horariosOcupados = agResult.rows.map(r => r.hora_inicio.slice(0, 5)); 

  const horariosLivres = disponiveis.filter(h => !horariosOcupados.includes(h));

  return horariosLivres;
};





export default { horariosPadrao, calcularDuracaoTotal, calcularHoraFim, criarAgendamento, buscarHorariosDisponiveis };
