<template>
	<div class="container mt-5">
		<div class="row">
			<div class="col-md-12">
				<div class="card border-0 rounded shadow">
					<div class="card-body">
						<h4>LAPORAN PENDAPATAN</h4>
						<hr />
						<form @submit.prevent="show">
							<div class="form-group mb-3">
								<label for="content" class="form-label">Tahun</label>
								<select class="form-control" v-model="tahun.tahun">
									<option v-for="item in dropdown" :key="item" :value="item">
										{{ item }}
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
		const total = reactive([]);
		const tahunNow = reactive([]);
		const tanggal = reactive([]);
		const tahun = reactive({
			tahun: '',
		});

		let dropdown = ref([])
		onMounted(() => {
			//get API from Laravel Backend
			axios.get('http://192.168.1.32:8000/api/exposedDropdown')
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
			let selectedTahun = tahun.tahun;
			console.log(selectedTahun)
			axios.get(`http://192.168.1.32:8000/api/laporanPendapatan/${selectedTahun}`)
				.then((response) => {
					console.log(response)
					laporan.push(response.data.data);
					total.push(response.data.total_tahunan);
					tahunNow.push(response.data.tahun);
					tanggal.push(response.data.tanggal);
					if (laporan.length > 0 && total.length > 0 && tahunNow.length > 0 && tanggal.length > 0) {
						console.log(laporan)
						const printContents = `
							<html>
							<head>
								<title>Laporan Pendapatan</title>
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
										height: 432px;
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

									.total-cell {
										text-align: right;
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
											<b><u>LAPORAN PENDAPATAN BULANAN</u></b><br>
											${tahunNow.map((data) => `
											PERIODE : ${data}<br>
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
												Bulan
											</th>
											<th>
												Aktivasi
											</th>
											<th>
												Deposit
											</th>
											<th>
												Total
											</th>
										</tr>
										<tr>
											<td>
												${data[0].nama_bulan}
											</td>
											<td>
												${data[0].total_aktivasi}
											</td>
											<td>
												${data[0].total_deposit}
											</td>
											<td>
												${data[0].total_bulanan}
											</td>
										</tr>
										<tr>
											<td>
												${data[1].nama_bulan}
											</td>
											<td>
												${data[1].total_aktivasi}
											</td>
											<td>
												${data[1].total_deposit}
											</td>
											<td>
												${data[1].total_bulanan}
											</td>
										</tr>
										<tr>
											<td>
												${data[2].nama_bulan}
											</td>
											<td>
												${data[2].total_aktivasi}
											</td>
											<td>
												${data[2].total_deposit}
											</td>
											<td>
												${data[2].total_bulanan}
											</td>
										</tr>
										<tr>
											<td>
												${data[3].nama_bulan}
											</td>
											<td>
												${data[3].total_aktivasi}
											</td>
											<td>
												${data[3].total_deposit}
											</td>
											<td>
												${data[3].total_bulanan}
											</td>
										</tr>
										<tr>
											<td>
												${data[4].nama_bulan}
											</td>
											<td>
												${data[4].total_aktivasi}
											</td>
											<td>
												${data[4].total_deposit}
											</td>
											<td>
												${data[4].total_bulanan}
											</td>
										</tr>
										<tr>
											<td>
												${data[5].nama_bulan}
											</td>
											<td>
												${data[5].total_aktivasi}
											</td>
											<td>
												${data[5].total_deposit}
											</td>
											<td>
												${data[5].total_bulanan}
											</td>
										</tr>
										<tr>
											<td>
												${data[6].nama_bulan}
											</td>
											<td>
												${data[6].total_aktivasi}
											</td>
											<td>
												${data[6].total_deposit}
											</td>
											<td>
												${data[6].total_bulanan}
											</td>
										</tr>
										<tr>
											<td>
												${data[7].nama_bulan}
											</td>
											<td>
												${data[7].total_aktivasi}
											</td>
											<td>
												${data[7].total_deposit}
											</td>
											<td>
												${data[7].total_bulanan}
											</td>
										</tr>
										<tr>
											<td>
												${data[8].nama_bulan}
											</td>
											<td>
												${data[8].total_aktivasi}
											</td>
											<td>
												${data[8].total_deposit}
											</td>
											<td>
												${data[8].total_bulanan}
											</td>
										</tr>
										<tr>
											<td>
												${data[9].nama_bulan}
											</td>
											<td>
												${data[9].total_aktivasi}
											</td>
											<td>
												${data[9].total_deposit}
											</td>
											<td>
												${data[9].total_bulanan}
											</td>
										</tr>
										<tr>
											<td>
												${data[10].nama_bulan}
											</td>
											<td>
												${data[10].total_aktivasi}
											</td>
											<td>
												${data[10].total_deposit}
											</td>
											<td>
												${data[10].total_bulanan}
											</td>
										</tr>
										<tr>
											<td>
												${data[11].nama_bulan}
											</td>
											<td>
												${data[11].total_aktivasi}
											</td>
											<td>
												${data[11].total_deposit}
											</td>
											<td>
												${data[11].total_bulanan}
											</td>
										</tr>
										<tr>
											<td colspan="3" class="total-cell">Total</td>
											${total.map((data) => `
											<td>${data}</td>
											`).join('')}
										</tr>
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
						total.length = 0
						tahunNow.length = 0
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
			total,
			tahunNow,
			tanggal,
			tahun,
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
