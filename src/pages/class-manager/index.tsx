import Grid from '@mui/material/Grid'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import Trophy from 'src/views/dashboard/Trophy'
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import TableColapsiblePaginate from 'src/views/tables/TableColapsiblePaginate'
import TableStickyHeader from 'src/views/tables/TableStickyHeader'
import CardImgTop from 'src/views/cards/CardImgTop'

const ClassManager = () => {
    return (
        <ApexChartWrapper>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <CardImgTop />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                </Grid>
                <Grid item xs={12}>
                    <TableStickyHeader />
                </Grid>
            </Grid>
        </ApexChartWrapper>
    )
}

export default ClassManager
