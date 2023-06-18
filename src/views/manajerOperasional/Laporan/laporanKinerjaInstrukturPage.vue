<template>
	<div class="container mt-5">
		<div class="row">
			<div class="col-md-12">
				<div class="card border-0 rounded shadow">
					<div class="card-body">
						<h4>LAPORAN KINERJA INSTRUKTUR</h4>
						<hr />
						<form @submit.prevent="show">
							<div class="form-group mb-3">
								<label for="content" class="form-label">Bulan</label>
								<select class="form-control" v-model="date.bulan">
									<option v-for="month in dropdown.months" :key="month.month" :value="month.month">
										{{ month.month }}
									</option>
								</select>
								<!-- <div v-if="validation.id_member" class="mt-2 alert alert-danger">
									{{ validation.id_member[0] }}
								</div> -->
							</div>
							<div class="form-group mb-3">
								<label for="content" class="form-label">Tahun</label>
								<select class="form-control" v-model="date.tahun">
									<option v-for="year in dropdown.years" :key="year.year" :value="year.year">
										{{ year.year }}
									</option>
								</select>
								<!-- <div v-if="validation.id_member" class="mt-2 alert alert-danger">
									{{ validation.id_member[0] }}
								</div> -->
							</div>
							<button type="submit" class="btn btn-primary">CETAK</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>  

<script>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
export default {
	setup() {
		//state aktivasi
		const laporan = reactive([]);
		const bulan = reactive([]);
		const tahun = reactive([]);
		const tanggal = reactive([]);
		const date = reactive({
			bulan: '',
			tahun: '',
		});

		let dropdown = ref([])
		onMounted(() => {
			//get API from Laravel Backend
			axios.get('https://gofit123.xyz/p3l_laravel/public/dropdownAktivitasKelas')
				.then(response => {
					//assign state posts with response data
					console.log(response)
					dropdown.value = response.data.data
				}).catch(error => {
					console.log(error.response.data)
				})
		})

		//state validation
		const validation = ref([]);

		//vue router
		const router = useRouter();

		//method store
		function show() {
			let selectedBulan = date.bulan;
			let selectedTahun = date.tahun;
			console.log(selectedBulan)
			console.log(selectedTahun)
			axios.get(`https://gofit123.xyz/p3l_laravel/public/laporanKinerjaInstruktur/${selectedBulan}/${selectedTahun}`)
				.then((response) => {
					console.log(response)
					laporan.push(response.data.data);
					bulan.push(response.data.bulan);
					tahun.push(response.data.tahun);
					tanggal.push(response.data.tanggal);
					if (laporan.length > 0 && bulan.length > 0 && tahun.length > 0 && tanggal.length > 0) {
						console.log(laporan)
						const printContents = `
						<html>
						<head>
							<title>Laporan Kinerja Instruktur</title>
							<style type="text/css">
							body {
									display: flex;
									justify-content: center;
									align-items: flex-start; /* Align items to the top */
									height: 100vh;
									margin: 0; /* Remove default body margin */
								}

							.card {
								width: 650px;
								height: auto;
								outline: 1px solid black;
								text-align: left;
								margin-top: 50px; /* Add margin to the top */
							}

							table, th, td {
								border-collapse: collapse;
								width: 650px; /* Set table width to 100% */
							}

							th, td {
								border: 1px solid black;
							}

							th:first-child, td:first-child {
								border-left: none; /* Remove left border for first column */
							}

							th:last-child, td:last-child {
								border-right: none; /* Remove right border for last column */
							}

							tr:last-child td {
								border-bottom: none; /* Remove bottom border for last row */
							}
							</style>
						</head>
						<body>
							<div class="card">
								<div class="title">
									<p>
										<b>GoFit</b><br>
										Jl. Centralpark No. 10 Yogyakarta
									<p>
										<b><u>LAPORAN KINERJA INSTRUKTUR BULANAN</u></b><br>
										${bulan.map((data) => `
										<u>Bulan : ${data}
										`).join('')}&emsp;
										${tahun.map((data) => `
										 Tahun : ${data}</u><br>
										 `).join('')}
										 ${tanggal.map((data) => `
											Tanggal cetak: ${data}
										 `).join('')}		
									</p>
								</div>
								${laporan.map((data) => `
								<table>
									<tr>
										<th>
											Nama
										</th>
										<th>
											Jumlah Hadir
										</th>
										<th>
											Jumlah Libur
										</th>
										<th>
											Waktu Terlambat (detik)
										</th>
									</tr>
									${data.map((item) => `
										<tr>
											<td>
												${item.nama_instruktur}
											</td>
											<td>
												${item.jumlah_hadir}
											</td>
											<td>
												${item.jumlah_libur}
											</td>
											<td>
												${item.waktu_terlambat}
											</td>
										</tr>
									`).join('')}
								</table>
								`).join('')}
							</div>
						</body>
						</html>`;
						const popup = window.open("", "_blank");
						popup.document.write(printContents);
						popup.document.close();
						popup.focus();
						popup.print();
						popup.close();
						laporan.length = 0
						bulan.length = 0
						tahun.length = 0
						tanggal.length = 0
					}
				})
				.catch((error) => {
					console.log(error.response.data);
				});
		}

		//return
		return {
			dropdown,
			laporan,
			bulan,
			tahun,
			tanggal,
			date,
			validation,
			router,
			show,
		};
	},
};

</script>
<style>
.custom-text-field-height {
	height: 55px;
}
</style>
