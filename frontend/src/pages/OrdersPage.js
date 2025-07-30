import React, { useState, useEffect } from 'react';
import api from '../services/api';

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [item, setItem] = useState('');
    const [address, setAddress] = useState('');
    const [quantity, setQuantity] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [agree, setAgree] = useState(false);
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        api.get('/orders').then(res => setOrders(res.data));
    }, []);

    const validate = () => {
        const errs = {};
        if (!item) errs.item = 'Item is required';
        if (!address) errs.address = 'Address is required';
        if (!quantity || isNaN(quantity) || Number(quantity) <= 0) errs.quantity = 'Quantity must be a positive number';
        if (!/^\d{10,15}$/.test(phone)) errs.phone = 'Phone must be 10-15 digits';
        if (!agree) errs.agree = 'You must accept the terms';
        if (!editingId && !image) errs.image = 'Image is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const resetForm = () => {
        setEditingId(null);
        setItem('');
        setAddress('');
        setQuantity('');
        setPhone('');
        setNotes('');
        setAgree(false);
        setImage(null);
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const formData = new FormData();
        formData.append('item', item);
        formData.append('deliveryAddress', address);
        formData.append('quantity', quantity);
        formData.append('phone', phone);
        formData.append('notes', notes);
        formData.append('agree', agree);
        if (image) formData.append('image', image);

        try {
            const res = editingId
                ? await api.put(`/orders/${editingId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                : await api.post('/orders', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

            if (editingId) {
                setOrders(orders.map(o => (o.id === editingId ? res.data : o)));
            } else {
                setOrders([...orders, res.data]);
            }
            resetForm();
        } catch (error) {
            console.error('Failed to submit order', error);
        }
    };

    const handleEdit = (order) => {
        setEditingId(order.id);
        setItem(order.item);
        setAddress(order.deliveryAddress);
        setQuantity(order.quantity);
        setPhone(order.phone);
        setNotes(order.notes);
        setAgree(order.agree);
    };

    const handleDelete = async (id) => {
        await api.delete(`/orders/${id}`);
        setOrders(orders.filter(o => o.id !== id));
        if (editingId === id) resetForm();
    };

    // Popup and alert state
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    // Show confirm dialog before delete
    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    // Confirm delete
    const confirmDelete = async () => {
        if (deleteId) {
            await api.delete(`/orders/${deleteId}`);
            setOrders(orders.filter(o => o.id !== deleteId));
            if (editingId === deleteId) resetForm();
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        }
        setShowConfirm(false);
        setDeleteId(null);
    };

    // Cancel delete
    const cancelDelete = () => {
        setShowConfirm(false);
        setDeleteId(null);
    };

    return (
        <div className="container">
            {showSuccess && (
                <div className="alert-success">
                    Order deleted successfully!
                </div>
            )}
            {showConfirm && (
                <div className="popup-overlay">
                    <div className="popup-confirm">
                        <p>Are you sure you want to delete this order?</p>
                        <div className="popup-actions">
                            <button className="btn-primary" onClick={confirmDelete}>Yes, Delete</button>
                            <button className="delete-btn" onClick={cancelDelete}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="banner">
                <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" alt="Banner" className="banner-img" />
                <div className="banner-text">
                    <h1>Order Management</h1>
                    <p>Place and manage your orders easily</p>
                </div>
            </div>

            <h2 className="form-title">{editingId ? 'Edit Order' : 'Create Order'}</h2>
            <form onSubmit={handleSubmit} className="order-form" encType="multipart/form-data">
                <div className="form-row">
                    <label>Item:</label>
                    <input name="item" value={item} onChange={e => setItem(e.target.value)} placeholder="e.g. Pizza" />
                    {errors.item && <small className="error">{errors.item}</small>}
                </div>
                <div className="form-row">
                    <label>Delivery Address:</label>
                    <input name="deliveryAddress" value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main St" />
                    {errors.address && <small className="error">{errors.address}</small>}
                </div>
                <div className="form-row">
                    <label>Quantity:</label>
                    <input name="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="1" />
                    {errors.quantity && <small className="error">{errors.quantity}</small>}
                </div>
                <div className="form-row">
                    <label>Phone Number:</label>
                    <input name="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="08912345678" />
                    {errors.phone && <small className="error">{errors.phone}</small>}
                </div>
                <div className="form-row">
                    <label>Notes:</label>
                    <textarea name="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add special instructions..." />
                </div>
                <div className="form-row">
                    <label>Upload Image:</label>
                    <input name="image" type="file" onChange={e => setImage(e.target.files[0])} />
                    {errors.image && <small className="error">{errors.image}</small>}
                </div>
                <div className="form-row">
                    <label className="checkbox-label">
                        <input name="agree" type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} /> I agree to terms
                    </label>
                    {errors.agree && <small className="error">{errors.agree}</small>}
                </div>
                <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Create'} Order</button>
            </form>

            <h3 className="orders-title">Your Orders</h3>
            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', fontSize: '1.1rem', margin: '2rem 0' }}>
                    No orders found. Start by creating a new order!
                </div>
            ) : (
                <ul className="order-list">
                    {orders.map(o => (
                        <li key={o.id} className="order-card">
                            <div className="order-header">
                                <div className="order-main-info">
                                    <span className="order-item">{o.item}</span>
                                    <span className="order-qty">x{o.quantity}</span>
                                </div>
                                <span className={`order-status status-${o.status?.toLowerCase()}`}>{o.status}</span>
                            </div>

                            <div className="order-details">
                                <div className="order-detail-row">
                                    <span className="detail-label">Delivery Address:</span>
                                    <span className="detail-value">{o.deliveryAddress}</span>
                                </div>
                                <div className="order-detail-row">
                                    <span className="detail-label">Phone:</span>
                                    <span className="detail-value">{o.phone}</span>
                                </div>
                                {o.notes && (
                                    <div className="order-detail-row">
                                        <span className="detail-label">Notes:</span>
                                        <span className="detail-value">{o.notes}</span>
                                    </div>
                                )}
                            </div>

                            {o.imageUrl && (
                                <div className="order-image-container">
                                    <img src={`http://localhost:4000${o.imageUrl}`} alt={o.item} className="order-image" />
                                </div>
                            )}

                            <div className="order-actions">
                                <button className="edit-btn" onClick={() => handleEdit(o)}>
                                    <span className="btn-icon">✏️</span>
                                    Edit
                                </button>
                                <button className="delete-btn" onClick={() => handleDeleteClick(o.id)}>
                                    <span className="btn-icon">🗑️</span>
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )
            }
            <style>{`
                body {
                    background: linear-gradient(120deg, #e0e7ff 0%, #f6f8fa 100%);
                }
                .container {
                    max-width: 700px;
                    margin: 2rem auto;
                    padding: 2.5rem 2rem;
                    background: #fff;
                    border-radius: 18px;
                    box-shadow: 0 8px 32px rgba(37,99,235,0.07);
                }
                .alert-success {
                    background: #dcfce7;
                    color: #166534;
                    border: 1.5px solid #bbf7d0;
                    border-radius: 8px;
                    padding: 1rem 1.5rem;
                    font-weight: 600;
                    font-size: 1.05rem;
                    margin-bottom: 1.2rem;
                    text-align: center;
                    box-shadow: 0 2px 8px rgba(16,185,129,0.08);
                    animation: fadeIn 0.3s;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px);}
                    to { opacity: 1; transform: translateY(0);}
                }
                .popup-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(30,41,59,0.18);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .popup-confirm {
                    background: #fff;
                    border-radius: 14px;
                    padding: 2rem 2.5rem;
                    box-shadow: 0 8px 32px rgba(37,99,235,0.13);
                    text-align: center;
                    min-width: 320px;
                    animation: fadeIn 0.2s;
                }
                .popup-confirm p {
                    font-size: 1.13rem;
                    color: #1e293b;
                    margin-bottom: 1.5rem;
                    font-weight: 600;
                }
                .popup-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                }
                .banner {
                    position: relative;
                    margin-bottom: 2rem;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 4px 24px rgba(37,99,235,0.09);
                }
                .banner-img {
                    width: 100%;
                    height: 180px;
                    object-fit: cover;
                    filter: brightness(0.65) blur(0.5px);
                }
                .banner-text {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    color: #fff;
                    text-shadow: 0 2px 12px rgba(0,0,0,0.35);
                    background: linear-gradient(90deg, rgba(37,99,235,0.25) 0%, rgba(30,64,175,0.15) 100%);
                }
                .banner-text h1 {
                    font-size: 2.5rem;
                    margin: 0;
                    font-weight: 800;
                    letter-spacing: 1px;
                }
                .banner-text p {
                    font-size: 1.15rem;
                    margin-top: 0.5rem;
                    font-weight: 500;
                }
                .form-title {
                    color: #1e40af;
                    margin-bottom: 1.5rem;
                    font-weight: 700;
                    font-size: 1.35rem;
                    letter-spacing: 0.5px;
                }
                .order-form {
                    background: #f1f5f9;
                    border-radius: 12px;
                    padding: 1.5rem 1rem;
                    box-shadow: 0 2px 8px rgba(37,99,235,0.04);
                    margin-bottom: 2rem;
                }
                .order-form .form-row {
                    margin-bottom: 1.1rem;
                }
                .order-form label {
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 0.3rem;
                    display: block;
                }
                .order-form input,
                .order-form textarea {
                    width: 100%;
                    padding: 0.7rem;
                    border: 1.5px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 1rem;
                    background: #f9fafb;
                    transition: border 0.2s;
                }
                .order-form input:focus,
                .order-form textarea:focus {
                    border-color: #2563eb;
                    outline: none;
                    background: #eef2ff;
                }
                .order-form input[type="checkbox"] {
                    width: auto;
                    margin-right: 0.5rem;
                }
                .checkbox-label {
                    display: flex;
                    align-items: center;
                    font-weight: 500;
                }
                .btn-primary {
                    background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
                    color: #fff;
                    border: none;
                    padding: 0.8rem 1.7rem;
                    border-radius: 8px;
                    font-size: 1.08rem;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(37,99,235,0.10);
                    transition: background 0.2s, transform 0.1s;
                    margin-top: 0.5rem;
                }
                .btn-primary:hover {
                    background: linear-gradient(90deg, #1e40af 0%, #2563eb 100%);
                    transform: translateY(-2px) scale(1.03);
                }
                .error {
                    color: #dc2626;
                    font-size: 0.9rem;
                    margin-top: 0.2rem;
                    display: block;
                }
                .orders-title {
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: #1e40af;
                    margin-bottom: 1.5rem;
                    margin-top: 2.5rem;
                    letter-spacing: 0.5px;
                    text-align: center;
                    padding-bottom: 0.5rem;
                    border-bottom: 3px solid #e0e7ff;
                }
                .order-list {
                    margin-top: 1.5rem;
                    padding: 0;
                    list-style: none;
                    display: grid;
                    gap: 1.2rem;
                }
                .order-card {
                    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 4px 16px rgba(37,99,235,0.08);
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                .order-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 4px;
                    height: 100%;
                    background: linear-gradient(to bottom, #2563eb, #1e40af);
                }
                .order-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 32px rgba(37,99,235,0.15);
                    border-color: #bfdbfe;
                }
                .order-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                    padding-bottom: 0.75rem;
                    border-bottom: 1px solid #e2e8f0;
                }
                .order-main-info {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .order-item {
                    font-weight: 700;
                    color: #1e40af;
                    font-size: 1.2rem;
                    letter-spacing: 0.3px;
                }
                .order-qty {
                    background: #dbeafe;
                    color: #1e40af;
                    font-weight: 600;
                    font-size: 0.9rem;
                    padding: 0.25rem 0.6rem;
                    border-radius: 20px;
                    border: 1px solid #bfdbfe;
                }
                .order-details {
                    margin-bottom: 1rem;
                    background: #f8fafc;
                    padding: 1rem;
                    border-radius: 10px;
                    border: 1px solid #e2e8f0;
                }
                .order-detail-row {
                    display: flex;
                    margin-bottom: 0.5rem;
                    align-items: flex-start;
                    gap: 0.75rem;
                }
                .order-detail-row:last-child {
                    margin-bottom: 0;
                }
                .detail-label {
                    font-weight: 600;
                    color: #64748b;
                    font-size: 0.9rem;
                    min-width: 120px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .detail-value {
                    color: #374151;
                    font-size: 0.95rem;
                    line-height: 1.4;
                    flex: 1;
                }
                .order-status {
                    font-size: 0.85rem;
                    font-weight: 700;
                    padding: 0.4rem 0.8rem;
                    border-radius: 20px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    border: 2px solid;
                }
                .status-completed {
                    background: #dcfce7;
                    color: #166534;
                    border-color: #bbf7d0;
                }
                .status-pending {
                    background: #fef3c7;
                    color: #92400e;
                    border-color: #fde68a;
                }
                .status-processing {
                    background: #dbeafe;
                    color: #1e40af;
                    border-color: #bfdbfe;
                }
                .order-image-container {
                    margin: 1rem 0;
                    text-align: center;
                }
                .order-image {
                    max-width: 120px;
                    height: 120px;
                    object-fit: cover;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    border: 3px solid #e2e8f0;
                    transition: transform 0.2s ease;
                }
                .order-image:hover {
                    transform: scale(1.05);
                }
                .order-actions {
                    display: flex;
                    gap: 0.75rem;
                    justify-content: flex-end;
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid #e2e8f0;
                }
                .edit-btn, .delete-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    border: none;
                    border-radius: 10px;
                    padding: 0.6rem 1.2rem;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                    border: 2px solid;
                }
                .btn-icon {
                    font-size: 1rem;
                }
                .edit-btn {
                    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
                    color: #1e40af;
                    border-color: #93c5fd;
                }
                .edit-btn:hover {
                    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
                    color: #fff;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(37,99,235,0.3);
                }
                .delete-btn {
                    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
                    color: #dc2626;
                    border-color: #fca5a5;
                }
                .delete-btn:hover {
                    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                    color: #fff;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(220,38,38,0.3);
                }
            `}</style>
        </div >
    );
}

export default OrdersPage;




