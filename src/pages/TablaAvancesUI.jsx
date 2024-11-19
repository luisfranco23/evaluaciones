import axios from 'axios';
import {
    MaterialReactTable,
    useMaterialReactTable,
    createMRTColumnHelper,
} from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { useEffect, useState } from 'react';
import { URLBASE } from '../lib/actions';

// Configuración para exportación CSV
const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
});

const columnHelper = createMRTColumnHelper();

// Definición de columnas con `createMRTColumnHelper`
const columns = [
    columnHelper.accessor('evaluadoresId', {
        header: '# Documento',
        size: 150,
    }),
    columnHelper.accessor('evaluadoresNombre', {
        header: 'Evaluador',
        size: 150,
    }),
    columnHelper.accessor('empresasNombre', {
        header: 'Empresa',
        size: 200,
    }),
    columnHelper.accessor('sedesNombre', {
        header: 'Sede',
        size: 150,
    }),
    columnHelper.accessor('Respuestas', {
        header: 'Finalizados',
        size: 120,
    }),
    columnHelper.accessor('Usuarios', {
        header: 'Total',
        size: 120,
    }),
    columnHelper.accessor('avance', {
        header: '% Avance',
        size: 120,
    })
];

export default function TablaAvancesUI() {
    const [informes, setInformes] = useState([]);

    // Obtener los datos de la API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${URLBASE}/informes`);
                const normalizedData = res?.data?.resp?.map((item) => ({
                    Usuarios: item.Usuarios,
                    Respuestas: item.Respuestas,
                    evaluadoresNombre: item['evaluadores.nombre'] == null ? "No Asignado" : item['evaluadores.nombre'],
                    empresasNombre: item['Empresas.nombre'],
                    evaluadoresId: item['evaluadores.idUsuario'] == null ? "No Asignado" : item['evaluadores.idUsuario'],
                    sedesNombre: item['Sedes.nombre'] == null ? "No Asignado" : item['Sedes.nombre'],
                    avance: `${(item.Respuestas * 100) / item.Usuarios}%`
                }));
                setInformes(normalizedData);
            } catch (error) {
                console.error("Error al obtener los informes:", error);
            }
        };
        fetchData();
    }, []);

    // Configuración de la tabla con `useMaterialReactTable`
    const table = useMaterialReactTable({
        columns,
        data: informes,
        enableRowSelection: false,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        enableDensityToggle: false,
        enableColumnResizing: false,
        enableFullScreenToggle: false,       
        renderTopToolbarCustomActions: () => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <Button
                    onClick={() => handleExportData(informes)}
                    startIcon={<FileDownloadIcon />}
                    color='success'
                >
                    Exportar todo
                </Button>
            </Box>
            
        ),
    });

    // Función para exportar todos los datos
    const handleExportData = (data) => {
        const csv = generateCsv(csvConfig)(data);
        download(csvConfig)(csv);
    };

    return (

        <div className='m-10'>
            <MaterialReactTable table={table} />
        </div>
    );
}