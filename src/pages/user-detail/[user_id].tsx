import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { Alert, AlertTitle, Card, CardHeader, Divider, IconButton, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, styled } from "@mui/material";
import AccountOutline from "mdi-material-ui/AccountOutline";
import EmailOutline from "mdi-material-ui/EmailOutline";
import { parse, format } from 'date-fns';
import { da, is } from "date-fns/locale";
import TableDense from "src/views/tables/TableDense";
import { set } from "nprogress";
import { Close } from "@mui/icons-material";

const ImgStyled = styled('img')(({ theme }) => ({
    width: 250,
    height: 250,
    marginRight: theme.spacing(6.25),
    borderRadius: theme.shape.borderRadius
}))

interface Classes {
    class_id: string;
    class_name: string;
    class_description: string;
}

interface UserDetail {
    _id: string,
    email: string,
    fullname: string,
    role: string,
    avatar: string,
    birthday: Date,
    login_type: string,
    is_ban: boolean,
    createdAt: string,
    updatedAt: string,
    classes: Classes[]
}

const UserDetail = () => {
    const router = useRouter();
    const { user_id } = router.query;
    const [profile, setProfile] = useState<UserDetail | null>(null)
    const [clickBan, setClickBan] = useState<boolean>(false);
    const [openAlert, setOpenAlert] = useState<boolean>(false)
    const [content, setContent] = useState<string>('')
    const [severity, setSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success')

    const fetchUserDetail = async () => {
        const apiResponse = await fetch(`/api/userManage/getUserDetail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                user_id: user_id
            })
        });

        if (apiResponse.ok) {
            const data = await apiResponse.json();
            return data;
        }
        else {
            const errorData = await apiResponse.json();
            return errorData;
        }
    };

    const banAccount = async () => {
        const apiResponse = await fetch(`/api/userManage/banAccount`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                user_id: user_id
            })
        });
        if (apiResponse.ok) {
            const data = await apiResponse.json();
            setSeverity('success');
            setContent(data.data.message);
            setOpenAlert(true);
            setClickBan(!clickBan)
        }
        else {
            const errorData = await apiResponse.json();
            setSeverity('error');
            setContent(errorData.error);
            setOpenAlert(true);
            setClickBan(!clickBan)
        }
    }

    useEffect(() => {
        const fetchUserData = async () => {
            const data = await fetchUserDetail();
            if (data.data) {
                setProfile(data.data);
            }
        }
        if (user_id) {
            fetchUserData()
        }
    }, [user_id, clickBan]);


    return (
        <Card sx={{ padding: 8 }}>
            <Grid container spacing={5}>
                <Grid item xs={12} sm={3} sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', order: { xs: 2, sm: 1 } }}>
                    <ImgStyled
                        src={profile?.avatar === null ? '/images/avatars/1.png' : profile?.avatar}
                        alt='Profile Pic'
                        sx={{ width: '100%', height: '100%', objectFit: 'cover', padding: 5, borderRadius: '10%', border: '5px solid #ccc', }}
                    />
                </Grid>
                <Grid item xs={12} sm={9} container spacing={2}>
                    <Grid sm={12}>
                        <Typography variant='h4' sx={{ marginBottom: 2, marginLeft: 4 }}>
                            User Information
                        </Typography>
                    </Grid>
                    <Grid sm={12}><Divider /></Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label='Full Name'
                            value={profile?.fullname}
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
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            type='email'
                            label='Email'
                            value={profile?.email}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <EmailOutline />
                                    </InputAdornment>
                                ),
                                readOnly: true
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label='Created At'
                            minRows={2}
                            value={profile?.createdAt}
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
                            label='Update At'
                            minRows={2}
                            value={profile?.updatedAt}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start' />
                                ),
                                readOnly: true
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField
                            fullWidth
                            label='Role'
                            minRows={2}
                            placeholder='Role'
                            value={profile?.role}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start' />
                                ),
                                readOnly: true
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label='Login Type'
                            minRows={2}
                            placeholder='Login type'
                            value={profile?.login_type}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start' />
                                ),
                                readOnly: true
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label='Birthday'
                            minRows={2}
                            placeholder='MM/DD/YYYY'
                            value={profile?.birthday}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start' />
                                ),
                                readOnly: true
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField
                            fullWidth
                            label='Is Ban'
                            minRows={2}
                            placeholder='MM/DD/YYYY'
                            value={profile?.is_ban ? 'Yes' : 'No'}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start' />
                                ),
                                readOnly: true
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3} >
                        <Button sx={{ marginTop: 2 }} variant='contained' onClick={banAccount}>
                            {profile?.is_ban ? 'Unban this account' : 'Ban this account'}
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
            <Card sx={{ marginTop: 5 }}>
                <CardHeader title='Joined Classes' titleTypographyProps={{ variant: 'h6' }} />
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
                        <TableBody>
                            {profile?.classes.map(row => (
                                <TableRow key={row.class_id} sx={{ '&:last-of-type  td, &:last-of-type  th': { border: 0 } }}>
                                    <TableCell component='th' scope='row'>
                                        {row.class_name}
                                    </TableCell>
                                    <TableCell align='left'>{row.class_description}</TableCell>
                                    <TableCell align='left'>{row.class_id.toString()}</TableCell>
                                    <TableCell align='left'>True</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Card>
    );
}

export default UserDetail;
