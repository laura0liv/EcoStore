import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaTshirt, FaSpinner, FaFilter, FaExclamationTriangle } from 'react-icons/fa'
import '../styles/css/CategoriasGenero.css'
import productosFalsosData from '../data/productosFalsos.json'

export const CategoriasGenero = () => {
    const { id } = useParams();
    const [categoriasPorGenero, setCategoriasPorGenero] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const cargarCategorias = () => {
            try {
                setLoading(true)
                setError(null)
                
                console.log('Cargando categorías para género ID:', id);
                
                // Obtener productos del género específico
                const productosDelGenero = productosFalsosData[id] || [];
                console.log('Productos del género:', productosDelGenero);
                
                // Extraer categorías únicas
                const categoriasUnicas = [];
                const categoriasVistas = new Set();
                
                productosDelGenero.forEach(producto => {
                    if (!categoriasVistas.has(producto.categoria)) {
                        categoriasVistas.add(producto.categoria);
                        categoriasUnicas.push({
                            id: categoriasUnicas.length + 1,
                            tipo: producto.categoria,
                            genero: producto.genero
                        });
                    }
                });
                
                console.log('Categorías únicas encontradas:', categoriasUnicas);
                setCategoriasPorGenero(categoriasUnicas);
                
            } catch (err) {
                console.error('Error al cargar categorías:', err);
                setError('Error al cargar las categorías')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            cargarCategorias()
        } else {
            console.warn('No se proporcionó ID de género');
            setLoading(false)
        }
    }, [id])

    if (loading) {
        return (
            <div className="categorias-loading">
                <FaSpinner className="spinner" />
                <span>Cargando categorías...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="categorias-error">
                <FaExclamationTriangle className="error-icon" />
                <div className="categorias-error-content">
                    <span className="error-message">Error al cargar categorías</span>
                    <button 
                        className="btn-reintentar"
                        onClick={() => window.location.reload()}
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="categorias-filter-container">
            <div className="categorias-filter-header">
                <FaFilter className="filter-icon" />
                <h3>Filtrar por Categoría</h3>
            </div>
            
            {categoriasPorGenero.length === 0 ? (
                <div className="no-categorias">
                    <FaTshirt className="no-categorias-icon" />
                    <span>No hay categorías disponibles</span>
                </div>
            ) : (
                <div className='categorias-filter-buttons'>
                    <Link 
                        className='categoria-filter-btn all-categories' 
                        to={`/productos/genero/${id}`}
                    >
                        Todas las categorías
                    </Link>
                    {categoriasPorGenero.map((categoria) => (
                        <Link 
                            className='categoria-filter-btn' 
                            to={`/productos/categoria/${categoria.tipo}`} 
                            key={categoria.id}
                        >
                            {categoria.tipo}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
