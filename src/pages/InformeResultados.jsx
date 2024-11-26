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

const InformeResultados = () => {
  const [datos, setDatos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${URLBASE}/informes/detalle`, {
          params: {},
        });
        setDatos(response.data?.response);
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
    columnHelper.group({
      header: 'Evaluador',
      columns: [
        columnHelper.accessor('evaluador.idUsuario', {
          header: '# Documento',
          size: 150,
        }),
        columnHelper.accessor('evaluador.nombre', {
          header: 'Nombre',
          size: 200,
        }),
        columnHelper.accessor('evaluador.cargo', {
          header: 'Cargo',
          size: 150,
        }),
        columnHelper.accessor('evaluador.fechaIngreso', {
          header: 'Fecha Ingreso',
          size: 150,
        }),
        columnHelper.accessor('evaluador.area', {
          header: 'Área',
          size: 150,
        }),
        columnHelper.accessor('evaluador.empresas', {
          header: 'Empresas',
          size: 250,
          Cell: ({ row }) =>
            row.original.evaluador.empresas
              .map((empresa) => empresa.nombre)
              .join(', '),
        }),
        columnHelper.accessor('evaluador.sedes', {
          header: 'Sedes',
          size: 250,
          Cell: ({ row }) =>
            row.original.evaluador.sedes
              .map((sede) => sede.nombre)
              .join(', '),
        }),
        columnHelper.accessor('evaluador.evaluaciones', {
          header: 'Resultados autoevaluación',
          size: 300,
          Cell: ({ row }) =>
            row.original.evaluador.evaluaciones
              .map(
                (dato) =>
                  `${dato.TipoEvaluacione?.nombre}, Nota: ${dato.promedio}, comentario: ${dato.comentario}`
              )
              .join(' | '),
        }),
        columnHelper.accessor('evaluador.nivelCargo', {
          header: 'Nivel de Cargo',
          size: 150,
        }),
      ],
    }),
    columnHelper.group({
      header: 'Colaborador',
      columns: [
        columnHelper.accessor('colaborador.idUsuario', {
          header: '# Documento',
          size: 150,
        }),
        columnHelper.accessor('colaborador.nombre', {
          header: 'Nombre',
          size: 200,
        }),
        columnHelper.accessor('colaborador.cargo', {
          header: 'Cargo',
          size: 150,
        }),
        columnHelper.accessor('colaborador.fechaIngreso', {
          header: 'Fecha Ingreso',
          size: 150,
        }),
        columnHelper.accessor('colaborador.area', {
          header: 'Área',
          size: 150,
        }),
        columnHelper.accessor('colaborador.empresas', {
          header: 'Empresas',
          size: 250,
          Cell: ({ row }) =>
            row.original.colaborador.empresas
              .map((empresa) => empresa.nombre)
              .join(', '),
        }),
        columnHelper.accessor('colaborador.sedes', {
          header: 'Sedes',
          size: 250,
          Cell: ({ row }) =>
            row.original.colaborador.sedes
              .map((sede) => sede.nombre)
              .join(', '),
        }),
        columnHelper.accessor('colaborador.nivelCargo', {
          header: 'Nivel de Cargo',
          size: 150,
        }),
        columnHelper.accessor('colaborador.evaluaciones', {
          header: 'Resultados Evaluación',
          size: 300,
          Cell: ({ row }) =>
            row.original.colaborador.evaluaciones
              .map(
                (dato) =>
                  `${dato.TipoEvaluacione?.nombre}, Nota: ${dato.promedio}, comentario: ${dato.comentario}`
              )
              .join(' | '),
        }),
      ],
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

  return (
    <div className="my-10 mx-24">
      <h1 className="text-xl font-bold text-start mb-5">
        Informe de Evaluadores y Colaboradores
      </h1>

      {isLoading ? (
        <p className="text-center">Cargando datos...</p>
      ) : (
        <MaterialReactTable
          columns={columns}
          data={datos}
          enableColumnResizing
          enableSorting
          enablePagination
          enableRowSelection
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
      )}
    </div>
  );
};

export default InformeResultados;
