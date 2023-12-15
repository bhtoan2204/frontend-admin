import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { Alert, AlertTitle, Card, CardHeader, CircularProgress, Divider, IconButton, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, styled } from "@mui/material";
import AccountOutline from "mdi-material-ui/AccountOutline";
import { Close, PeopleAltOutlined } from "@mui/icons-material";
import format from 'date-fns/format';
import { getCookie } from "src/utils/cookies";
import { TimerOutline } from "mdi-material-ui";
import { fetchActiveClass } from "src/pages/api/classManage/activeClass";
import { fetchClassDetail } from "src/pages/api/classManage/getClassDetails";
import ErrorFetch from "src/pages/fetchError";

const ImgStyled = styled('img')(({ theme }) => ({
    width: 250,
    height: 250,
    marginRight: theme.spacing(6.25),
    borderRadius: theme.shape.borderRadius
}))

const isValidClassId = (classId: any) => {
    if (typeof classId !== 'string') {
        return false;
    }
    if (classId.length !== 24) {
        return false;
    }
    const isHex = /^[0-9a-fA-F]+$/.test(classId);
    if (!isHex) {
        return false;
    }
    return true;
};

interface ClassDetailData {
    id: string;
    className: string;
    description: string;
    host: {
        id: string;
        fullname: string;
        avatar: string;
    };
    createdAt: Date;
    is_active: string;
}

interface TeacherData {

}

const TeacherTable = () => {
    return (
        <Card sx={{ marginTop: 5 }}>
            <CardHeader title='Teachers' titleTypographyProps={{ variant: 'h6' }} />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size='small' aria-label='a dense table'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Class name</TableCell>
                            <TableCell align='left'>Class Description</TableCell>
                            <TableCell align='left'>Class Id</TableCell>
                            <TableCell align='left'>Is Active</TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>
        </Card>
    )
}

interface ClassDetailProps {
    class_id: string;
}

const ClassDetail: React.FC<ClassDetailProps> = ({ class_id }) => {
    const [clickActive, setClickActive] = useState<boolean>(false);
    const [openAlert, setOpenAlert] = useState<boolean>(false)
    const [content, setContent] = useState<string>('')
    const [severity, setSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success')
    const [loading, setLoading] = useState(true);
    const [classDetail, setClassDetail] = useState<ClassDetailData | null>(null);

    const activeClass = async () => {
        const data = await fetchActiveClass(class_id as string, getCookie('accessToken') as string);
        if (data.status === 200) {
            setClickActive(!clickActive);
            setOpenAlert(true);
            setContent(data.data.message);
            setSeverity('success');
        }
        else {
            setOpenAlert(true);
            setContent("Something went wrong!");
            setSeverity('error');
        }
    }

    useEffect(() => {
        console.log(class_id)
        if (class_id != undefined && isValidClassId(class_id)) {
            const fetchUserData = async () => {
                try {
                    const data = await fetchClassDetail(class_id as string, getCookie('accessToken') as string);
                    if (data) {
                        setClassDetail(data);
                    }
                    else {
                        setClassDetail(null);
                    }
                }
                catch (error) {
                    setClassDetail(null);
                    setLoading(false);
                }
                finally {
                    setLoading(false);
                }
            };
            if (class_id) {
                fetchUserData()
            }
        }
        else {
            setLoading(false);
        }
    }, [class_id, clickActive]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </div>
        );
    }
    if (classDetail === null) return (<ErrorFetch />)

    else {
        return (
            <Card sx={{ padding: 8 }}>
                <Grid container spacing={5}>
                    <Grid item xs={12} sm={3} sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', order: { xs: 2, sm: 1 } }}>
                        <ImgStyled
                            src={classDetail?.host.avatar === null ? '/images/avatars/1.png' : classDetail?.host.avatar}
                            alt='Profile Pic'
                            sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10%', }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={9} container spacing={2}>
                        <Grid item sm={12}><Divider /></Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label='Class Name'
                                value={classDetail?.className || ''}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <PeopleAltOutlined />
                                        </InputAdornment>
                                    ),
                                    readOnly: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                fullWidth
                                label='Class Description'
                                minRows={2}
                                multiline
                                value={classDetail?.description || ''}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start' />
                                    ),
                                    readOnly: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label='Host Name'
                                minRows={2}
                                value={classDetail?.host.fullname || ''}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <AccountOutline />
                                        </InputAdornment>
                                    ),
                                    readOnly: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label='Created At'
                                minRows={2}
                                value={classDetail?.createdAt ? format(new Date(classDetail.createdAt), 'MM/dd/yyyy') : ''}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <TimerOutline />
                                        </InputAdornment>
                                    ),
                                    readOnly: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                fullWidth
                                label='Is Active'
                                minRows={2}
                                value={classDetail?.is_active}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start' />
                                    ),
                                    readOnly: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} >
                            <Button sx={{ marginTop: 2 }} variant='contained' onClick={activeClass}>
                                {classDetail?.is_active ? 'Active this class' : 'Inactive this class'}
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={9} >
                            {openAlert ? (
                                <Alert
                                    severity={severity}
                                    sx={{ '& a': { fontWeight: 400 } }}
                                    action={
                                        <IconButton size='small' color='inherit' aria-label='close' onClick={() => setOpenAlert(false)}>
                                            <Close fontSize='inherit' />
                                        </IconButton>
                                    }
                                >
                                    <AlertTitle>{content}</AlertTitle>
                                </Alert>
                            ) : null}
                        </Grid>
                    </Grid>
                </Grid>
                <Divider />
                <TeacherTable />
            </Card>
        );
    }
}

export default ClassDetail;
