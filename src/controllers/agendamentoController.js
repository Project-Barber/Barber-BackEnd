import agendamentoModels from "../models/agendamentoModels.js";
import userModels from '../models/userModels.js';
import logger from "../utils/logger.js";
import functionsBasic from '../utils/basicFunctions.js';

const criarAgendamento = async (req, res) => {
  try {
    logger.info("Iniciando criação de agendamento");
    const {id_barbeiro, data, hora_inicio, ids_servicos } = req.body;
    const id_usuario = req.userId;

    if (!data || !hora_inicio || !ids_servicos?.length) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }
    
    const dataFormatada = await functionsBasic.formatDate(data);

    const user = await userModels.findUserByID(id_usuario);
    if (!user || id_usuario === id_barbeiro) {
        return res.status(400).json({ error: "Usuário inválido" });
    }

    const barbeiro = await userModels.findUserByID(id_barbeiro);
    if (!barbeiro || barbeiro.tipo_usuario !== 'barber') {
        return res.status(400).json({ error: "Barbeiro inválido" });
    }

    const hoje = new Date();
    const dataSolicitada = new Date(dataFormatada);
    hoje.setHours(0, 0, 0, 0);
    dataSolicitada.setHours(0, 0, 0, 0);
    if (dataSolicitada < hoje) {
      return res.status(400).json({ error: "A data não pode ser no passado." });
    }

    // Verifica se o horário informado é válido para aquele dia
    const diaSemana = new Date(dataFormatada).toLocaleDateString("pt-BR", { weekday: 'long' })
  .normalize("NFD").replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace("-feira", "");


    const horariosPadrao = agendamentoModels.horariosPadrao;

    const horariosValidos = horariosPadrao[diaSemana];

    if (!horariosValidos || horariosValidos.length === 0) {
      return res.status(400).json({ error: "O barbeiro não atende nesse dia." });
    }

    if (!horariosValidos.includes(hora_inicio)) {
      return res.status(400).json({ error: "Horário não permitido para esse dia." });
    }

    // Duração total dos serviços
    const duracaoTotal = await agendamentoModels.calcularDuracaoTotal(ids_servicos);
    if (!duracaoTotal) return res.status(400).json({ error: "Serviços inválidos." });

    // Calcular hora fim
    const horaFim = agendamentoModels.calcularHoraFim(hora_inicio, duracaoTotal);
    logger.info(`Hora fim calculada: ${horaFim}`);

    // Criar agendamento
    const agendamento = await agendamentoModels.criarAgendamento(
      id_usuario, id_barbeiro, dataFormatada, hora_inicio, horaFim, ids_servicos
    );

    res.status(201).json({ message: "Agendamento realizado com sucesso", agendamento });

  } catch (error) {
    logger.error("Erro ao criar agendamento:", error.message);
    res.status(500).json({ error: error.message || "Erro interno" });
  }
};

const horariosDisponiveis = async (req, res) => {
  try {
    const { id_barbeiro, data } = req.query;

    if (!id_barbeiro || !data) {
      return res.status(400).json({ error: "Parâmetros obrigatórios: id_barbeiro e data" });
    }
    
    const dataFormatada = await functionsBasic.formatDate(data);

    const barbeiro = await userModels.findUserByID(id_barbeiro);
    if (!barbeiro || barbeiro.tipo_usuario !== 'barber') {
        return res.status(400).json({ error: "Barbeiro inválido" });
    }

    const hoje = new Date();
    const dataSolicitada = new Date(dataFormatada);
    hoje.setHours(0, 0, 0, 0);
    dataSolicitada.setHours(0, 0, 0, 0);

    if (dataSolicitada < hoje) {
      return res.status(400).json({ error: "A data não pode ser no passado." });
    }

    const horarios = await agendamentoModels.buscarHorariosDisponiveis(id_barbeiro, dataFormatada);
    res.status(200).json({ horarios_disponiveis: horarios });

  } catch (error) {
    logger.error("Erro ao buscar horários disponíveis:", error);
    res.status(500).json({ error: "Erro ao buscar horários disponíveis" });
  }
};


const getServicos = async (req, res) => {
  logger.info("Procurando serviços disponíveis");
  try {
    const services = await agendamentoModels.getServicos();
    res.status(200).json({ services });
  } catch (error) {
    logger.error("Erro ao buscar serviços:", error);
    res.status(500).json({ error: "Erro ao buscar serviços" });
  }
}


export default { criarAgendamento, horariosDisponiveis, getServicos };
