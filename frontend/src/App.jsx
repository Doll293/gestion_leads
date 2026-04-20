import './App.css';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { PlusCircle, Edit, Trash2 } from 'react-feather';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API = '/api';

const blankLead = { nom: '', statut: '', tel: '', adresse: '', commentaire: '' };

function App() {
  const [leads, setLeads] = useState([]);
  const [lead, setLead] = useState(blankLead);
  const [action, setAction] = useState('Add');
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = () => {
    axios.get(`${API}/leads`)
      .then((res) => setLeads(res.data))
      .catch((err) => setError('Erreur lors du chargement des leads: ' + err.message));
  };

  const openAddModal = () => {
    setLead(blankLead);
    setAction('Add');
    setOpen(true);
  };

  const openEditModal = (l) => {
    setLead(l);
    setEditId(l.id);
    setAction('Edit');
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setLead(blankLead);
    setEditId(null);
    setAction('Add');
  };

  const saveLead = () => {
    if (action === 'Add') {
      axios.post(`${API}/leads`, lead)
        .then((res) => {
          setLeads([res.data, ...leads]);
          closeModal();
        })
        .catch((err) => setError('Erreur lors de l\'ajout: ' + err.message));
    } else {
      axios.put(`${API}/leads/${editId}`, lead)
        .then((res) => {
          setLeads(leads.map((l) => (l.id === editId ? res.data : l)));
          closeModal();
        })
        .catch((err) => setError('Erreur lors de la modification: ' + err.message));
    }
  };

  const deleteLead = (id) => {
    axios.delete(`${API}/leads/${id}`)
      .then(() => setLeads(leads.filter((l) => l.id !== id)))
      .catch((err) => setError('Erreur lors de la suppression: ' + err.message));
  };

  const filtered = leads.filter((l) => {
    const q = searchTerm.toLowerCase();
    return (
      l.nom?.toLowerCase().includes(q) ||
      l.statut?.toLowerCase().includes(q) ||
      l.tel?.toLowerCase().includes(q) ||
      l.adresse?.toLowerCase().includes(q) ||
      l.commentaire?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container">
      <div className="d-flex">
        <h1>Gestion des leads</h1>
      </div>
      <hr />

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <div className="toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn" onClick={openAddModal}>
          <PlusCircle size={16} />
          <span>Ajouter</span>
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Statut</th>
            <th>Tél</th>
            <th>Adresse</th>
            <th>Commentaire</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>Aucun lead trouvé</td>
            </tr>
          ) : (
            filtered.map((l) => (
              <tr key={l.id}>
                <td>{l.nom}</td>
                <td>{l.statut}</td>
                <td>{l.tel}</td>
                <td>{l.adresse}</td>
                <td>{l.commentaire}</td>
                <td>
                  <button className="btn m12" onClick={() => openEditModal(l)}>
                    <Edit size={14} />
                    <span>Modifier</span>
                  </button>
                  <button className="btn btn-danger m12" onClick={() => deleteLead(l.id)}>
                    <Trash2 size={14} />
                    <span>Supprimer</span>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Modal open={open} onClose={closeModal} center>
        <h2>{action === 'Add' ? 'Ajouter' : 'Modifier'} un lead</h2>
        <div className="form">
          <label>Nom</label>
          <input type="text" value={lead.nom} onChange={(e) => setLead({ ...lead, nom: e.target.value })} />
          <label>Statut</label>
          <input type="text" value={lead.statut} onChange={(e) => setLead({ ...lead, statut: e.target.value })} />
          <label>Tél</label>
          <input type="text" value={lead.tel} onChange={(e) => setLead({ ...lead, tel: e.target.value })} />
          <label>Adresse</label>
          <textarea value={lead.adresse} rows={3} onChange={(e) => setLead({ ...lead, adresse: e.target.value })} />
          <label>Commentaire</label>
          <textarea value={lead.commentaire} rows={3} onChange={(e) => setLead({ ...lead, commentaire: e.target.value })} />
          <button className="btn" onClick={saveLead}>
            {action === 'Add' ? 'Ajouter' : 'Enregistrer'}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
