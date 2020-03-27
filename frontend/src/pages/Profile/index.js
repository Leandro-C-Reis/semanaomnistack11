import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi';

import api from '../../services/api';
import './styles.css'

import logoImg from '../../assets/logo.svg'

export default function Profile() {
  // conexao com back-end, e busca de casos especificos da ong.
  const [incidents, setIncidents] = useState([]);

  const history = useHistory();
  
  const ongId =  localStorage.getItem('ongId');
  const ongName =  localStorage.getItem('ongName');

  /*useEffect recebe dois parametros: primeiro é função a ser executada, 
  o segundo é quando ela será execuntada: formato "useEffect(() => {}, [])"*/
  useEffect(() => {
    api.get('/profile', {
      headers: {
        Authorization: ongId,
      }
    }).then(response => {
      setIncidents(response.data);
    })
  }, [ongId]);

  // função para deletar um caso.
  async function handleDeleteIncident(id) {
    try {
      await api.delete(`incidents/${id}`, {
        headers: {
          Authorization: ongId,
        }
      });
      
      //atualizar a pagina com incidentes deletados
      setIncidents(incidents.filter(incident => incident.id !== id));
    }catch (err) {
      alert('Erro ao deletar caso, tente novamente.');
    }
  }

  // função para deslogar o usuário
  function handleLogout() {
    localStorage.clear();

    history.push('/');
  }

  //HTML retornado.
  return (
    <div className="profile-container">
      <header>
        <img src={logoImg} alt="Be The Hero"/>
        <span>Bem vinda, {ongName}</span>

        <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>
        <button onClick={handleLogout} type="button">
          <FiPower size={18} color="#e02041" />
        </button>
      </header>

      <h1>Casos cadastrados</h1>
      
      <ul>
        {incidents.map(incident => (
          <li key={incident.id}>
            <strong>CASO:</strong>
            <p>{incident.title}</p>
            
            <strong>DESCRIÇÃO:</strong>
            <p>{incident.description}</p>

            <strong>VALOR:</strong>
            <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(incident.value)}</p>

            {/* se "onClick={handleDeleteIncident(incident.id)}" --> então ele ira pedir apenas o 
            retorno da função, apagando todos os incidente. o Método certo está abaixo.*/}
            <button onClick={() => handleDeleteIncident(incident.id)} type="button">
              <FiTrash2 size={20} color="#a8a8b3" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}