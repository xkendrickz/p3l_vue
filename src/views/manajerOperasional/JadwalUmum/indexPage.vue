<template>
	<div class="d-flex justify-content-between flex-wrap flex-mdnowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
		<h1 class="h2">LIST JADWAL UMUM</h1>
	</div>
	<div class="container mt-5">
		<div class="row">
			<div class="col-md-12">
				<div class="card border-0 rounded shadow">
					<div class="card-body">
						<router-link :to="{ name: 'mo.jadwalUmum.create' }" class="btn btn-md btn-success mb-4">Tambah
							Jadwal</router-link>
						<th scope="rowgroup">MORNING CLASS</th>
						<table class="table table-striped table-bordered mt-4">
							<tbody>
								<tr v-for="(jadwalumum, id) in groupedJadwalUmum" :key="id">
									<td>{{ formatDate(jadwalumum[0].hari) }}</td>
									<td>
										{{ jadwalumum[0].jam }} <br>
										{{ jadwalumum[0].nama_kelas }} <br>
										{{ jadwalumum[0].nama_instruktur }} <br>
									</td>
									<td>
										<router-link
											:to="{ name: 'mo.jadwalUmum.edit', params: { id: jadwalumum[0].id_jadwal_umum } }"
											class="btn btn-sm btn-primary mr-1">EDIT</router-link>
										<button @click.prevent="jadwalUmumDelete(jadwalumum[0].id_jadwal_umum)"
											class="btn btn-sm btn-danger ml-1">DELETE</button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="card-body">
						<th scope="rowgroup">EVENING CLASS</th>
						<table class="table table-striped table-bordered mt-4">
							<tbody>
								<tr v-for="(jadwalumum, id) in groupedJadwalUmum2" :key="id">
									<td>{{ formatDate(jadwalumum[0].hari) }}</td>
									<td>
										{{ jadwalumum[0].jam }} <br>
										{{ jadwalumum[0].nama_kelas }} <br>
										{{ jadwalumum[0].nama_instruktur }} <br>
									</td>
									<td>
										<router-link
											:to="{ name: 'mo.jadwalUmum.edit', params: { id: jadwalumum[0].id_jadwal_umum } }"
											class="btn btn-sm btn-primary mr-1">EDIT</router-link>
										<button @click.prevent="jadwalUmumDelete(jadwalumum[0].id_jadwal_umum)"
											class="btn btn-sm btn-danger ml-1">DELETE</button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import axios from 'axios'
import { onMounted, ref, computed } from 'vue'
import { useToast } from "vue-toastification";

export default {

	setup() {
		let jadwal_umum = ref([])
		let toast = useToast();

		const groupedJadwalUmum = computed(() => {
			const filteredData = jadwal_umum.value.filter(item => item.jam >= '00:00' && item.jam < '11:59');
			const groups = {};
			filteredData.forEach((item) => {
				const key = `${item.hari}-${item.nama_kelas}`;
				if (!groups[key]) {
					groups[key] = [];
				}
				groups[key].push(item);
			});
			return Object.values(groups);
		});

		const groupedJadwalUmum2 = computed(() => {
			const filteredData = jadwal_umum.value.filter(item => item.jam >= '12:00' && item.jam < '23:59');
			const groups = {};
			filteredData.forEach((item) => {
				const key = `${item.hari}-${item.nama_kelas}`;
				if (!groups[key]) {
					groups[key] = [];
				}
				groups[key].push(item);
			});
			return Object.values(groups);
		});

		const formatDate = computed(() => {
			return function (date) {
				const options = { weekday: 'short' }
				const day = new Date(date).toLocaleDateString('en-us', options)
				return day.toUpperCase()
			}
		})

		onMounted(() => {
			axios.get('http://192.168.1.32:8000/api/jadwalUmum')
				.then(response => {
					jadwal_umum.value = response.data.data;
				})
				.catch(error => {
					console.log(error)
					toast.error('Terjadi Kesalahan!');
				})
		})

		function jadwalUmumDelete(id_jadwal_umum) {
			axios.delete(`http://192.168.1.32:8000/api/jadwalUmum/${id_jadwal_umum}`)
				.then(() => {
					toast.error("Berhasil Hapus Jadwal Umum !", {
						timeout: 2000
					})
					jadwal_umum.value.splice(jadwal_umum.value.indexOf(id_jadwal_umum), 1);
					localStorage.setItem("showToast", "true"); // Set flag to show toast
					window.location.reload();
				}).catch(error => {
					console.log(error.response.data)
				})
		}
		// Check for the flag and show the toastification if it's set
		if (localStorage.getItem("showToast")) {
			toast.error("Berhasil Hapus Jadwal Umum !", {
				timeout: 2000
			});
			localStorage.removeItem("showToast"); // Remove the flag
		}

		return {
			jadwal_umum,
			groupedJadwalUmum,
			groupedJadwalUmum2,
			formatDate,
			jadwalUmumDelete,
		}
	}
}
</script>
