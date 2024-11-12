import { useParams } from 'react-router-dom';

const Seguimiento = () => {

  const { idUsuario } = useParams();

  return (
    <div>
        
        Haciendole el seguimiento a {
            idUsuario
        }
    </div>
  )
}

export default Seguimiento