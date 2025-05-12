import { useEffect, useRef, useState } from 'react';
import {
    MaterialReactTable,
    createMRTColumnHelper,
} from 'material-react-table';
import axios from 'axios';
import { URLBASE } from '../lib/actions';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { Button, Box } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useUser } from '../context/UserContext';
import Loading from './Loading';
import { toast } from 'react-toastify';

const InformeDetalleGrupo = () => {
    const [datos, setDatos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const user = useUser()
      const [evaluaciones, setEvaluaciones] = useState([])
      const idEvaluacion = useRef(null)
      const [IdEvaluacion, setIdEvaluacion] = useState(null)

    useEffect(() => {
        const fetchEvaluaciones = async () => {
            try {
                const evaluacionesResponse = await axios.get(`${URLBASE}/evaluaciones/gestionar`);
                setEvaluaciones(evaluacionesResponse?.data?.data || []);
            } catch (error) {
                console.error(error);
                toast.error("Error al obtener las evaluaciones!");
            }
        };
        fetchEvaluaciones();
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            if (IdEvaluacion == null) return
            setIsLoading(true);
            try {
                const informeResponse = await axios.get(`${URLBASE}/informes/resultados/detalle`, {
                    params: { idEvaluador: user?.user?.idUsuario, idEvaluacion: IdEvaluacion},
                });
                setDatos(informeResponse.data.informe);
            } catch (error) {
                console.error(error);
                toast.error("Error al obtener los datos!");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user?.user?.idUsuario, user?.user?.Empresas, IdEvaluacion]);



    const columnHelper = createMRTColumnHelper();

    const columns = [
        // Configuración de columnas (igual a la anterior)
        columnHelper.accessor('tipo', {
            header: 'Tipo',
            size: 200,
        }),
        columnHelper.accessor('ID_Evaluador', {
            header: '# Documento evaluador',
            size: 200,
        }),
        columnHelper.accessor('Evaluador', {
            header: 'Nombre evaluador',
            size: 200,
        }),
        columnHelper.accessor('cargo_evaluador', {
            header: 'Cargo Evaluador',
            size: 200,
        }),
        columnHelper.accessor('empresa_evaluador', {
            header: 'Empresa evaluador',
            size: 200,
        }),
        columnHelper.accessor('ID_Colaborador', {
            header: '# Documento',
            size: 200,
        }),
        columnHelper.accessor('Colaborador', {
            header: 'Nombre Colaborador',
            size: 200,
        }),
        columnHelper.accessor('cargo', {
            header: 'Cargo Colaborador',
            size: 200,
        }),
        columnHelper.accessor('area', {
            header: 'Área Colaborador',
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
        columnHelper.accessor('Competencia', {
            header: 'Competencia',
            size: 200,
        }),
        columnHelper.accessor('promedio', {
            header: 'Promedio competencia',
            size: 200,
        })
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
        <div className='ml-20'>
            <div className='flex flex-col gap-4 mb-4'>
                <h1 className="text-xl font-bold text-start my-5">Informe de Evaluadores y Colaboradores Detalle</h1>
                <select ref={idEvaluacion} className="w-80 border-gray-300 rounded-md" name="evaluacion" id="id-evaluacion" onChange={() => setIdEvaluacion(idEvaluacion.current.value)}>
                    <option disabled selected>Seleccione...</option>
                    {evaluaciones?.map((evaluacion, index) => (
                        <option key={index} value={evaluacion.idEvaluacion}>{`${evaluacion.nombre} ${evaluacion.año}`}</option>
                    ))}
                </select>
            </div>
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

export default InformeDetalleGrupo;
