import React, {useEffect, useState } from 'react';
import './App.css';
import contactService from './contact-service.js';
import ContactForm from './components/ContactForm/ContactForm';
import ContactList from './components/ContactList/ContactList';

function App() {

	const [contacts, setContacts] = useState([]);
	const [contactForEdit, setContactForEdit] = useState(createEmptyContact());

	function createEmptyContact() {
		return {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
		};
	}

	useEffect(() => {
		contactService.get('/').then(({ data }) => {
			if (!data) {
				setContacts([]);
			} else {
				console.log(data);
				setContacts(data);
			}
		});
	}, [])

	const deleteContact = (id) => {
		contactService.delete(`/${id}`);
		const newContacts = contacts.filter((contact) => contact.id !== id);
		setContacts(newContacts);
	};

	const saveContact = (contact) => {
		if (!contact.id) {
			createContact(contact);
		} else {
			updateContact(contact);
		}
	};

	const addNewContact = () => {
		setContactForEdit(createEmptyContact());
	};

	const selectContact = (contact) => {
		setContactForEdit(contact);
	};

	function createContact(contact) {
		contact.id = Date.now();
		contactService.post('/', contact).then(({ data }) => {
			const newContacts = [...contacts, data];
			setContacts(newContacts);
		});
		setContactForEdit(createEmptyContact())
	}
	function updateContact(contact) {
		contactService.put(`/${contact.id}`, contact).then(({ data }) => {
			const newContacts = contacts.map((item) => item.id === data.id ? data : item);
			setContacts(newContacts);
		})
		setContactForEdit(createEmptyContact());
}

	
		return (
			<div className='container'>
				<h1 className='header-app'>Contact List</h1>
				<div className='main'>
					<ContactList
						contacts={contacts}
						onDelete={deleteContact}
						onAddContact={addNewContact}
						onEditContact={selectContact}
					/>
					<ContactForm
						key={contactForEdit.id}
						contactForEdit={contactForEdit}
						onSubmit={saveContact}
						onDelete={deleteContact}
					/>
				</div>
			</div>
		);
	}


export default App;





