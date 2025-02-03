import { useEffect, useState } from 'react';
import {
  MaterialReactTable,
  createMRTColumnHelper,
} from 'material-react-table';
import axios from 'axios';
import { URLBASE } from '../lib/actions';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { Button, Box } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Loading from './Loading';

const InformeResultados = () => {
  const [datos, setDatos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${URLBASE}/informes/detalle`, {
          params: {},
        });
        setDatos(response.data?.informe);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const columnHelper = createMRTColumnHelper();

  const columns = [
    // Configuración de columnas (igual a la anterior)
    columnHelper.accessor('ID_Evaluador', {
      header: '# Documento',
      size: 200,
    }),
    columnHelper.accessor('Evaluador', {
      header: 'Nombre evaluador',
      size: 200,
    }),
    columnHelper.accessor('cargo_evaluador', {
      header: 'Cargo evaluador',
      size: 200,
    }),
    columnHelper.accessor('empresa_evaluador', {
      header: 'Empresa',
      size: 200,
    }),
    columnHelper.accessor('ID_Colaborador', {
      header: '# Documento',
      size: 200,
    }),
    columnHelper.accessor('Colaborador', {
      header: 'Nombre colaborador',
      size: 200,
    }),
    columnHelper.accessor('cargo', {
      header: 'Cargo colaborador',
      size: 200,
    }),
    columnHelper.accessor('area', {
      header: 'Área colaborador',
      size: 200,
    }),
    columnHelper.accessor('fechaIngreso', {
      header: 'Fecha Ingreso Colaborador',
      size: 200,
    }),
    columnHelper.accessor('Empresa', {
      header: 'Empresa Colaborador',
      size: 200,
    }),
    columnHelper.accessor('Sede', {
      header: 'Sede Colaborador',
      size: 200,
    }),
    columnHelper.accessor('AUTOEVALUACION', {
      header: 'Prom. Autoevaluación',
      size: 200,
    }),
    columnHelper.accessor('EVALUACION', {
      header: 'Evaluación',
      size: 200,
    }),
  ];

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });

  const handleExportData = (data) => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  if (isLoading) {
    return (
      <Loading />
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-start my-5">
        Informe de Evaluadores y Colaboradores
      </h1>
      <MaterialReactTable
        columns={columns}
        data={datos}
        enableColumnResizing
        enableSorting
        enablePagination
        renderTopToolbarCustomActions={() => (
          <Box
            sx={{
              display: 'flex',
              gap: '16px',
              padding: '8px',
              flexWrap: 'wrap',
            }}
          >
            <Button
              onClick={() => handleExportData(datos)}
              startIcon={<FileDownloadIcon />}
              color="success"
            >
              Exportar todo
            </Button>
          </Box>
        )}
      />
    </div>
  );
};

export default InformeResultados;
