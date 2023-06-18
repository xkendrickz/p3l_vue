<template>
	<div class="container mt-5">
		<div class="row">
			<div class="col-md-12">
				<div class="card border-0 rounded shadow">
					<div class="card-body">
						<h4>AKTIVASI</h4>
						<hr />
						<form @submit.prevent="store">
							<div class="form-group mb-3">
								<label for="content" class="form-label">Member</label>
								<select class="form-control" v-model="aktivasi.id_member">
									<option v-for="member in members" :key="member.id_member" :value="member.id_member">
										{{ member.nama_member }}</option>
								</select>
								<div v-if="validation.id_member" class="mt-2 alert alert-danger">
									{{ validation.id_member[0] }}
								</div>
							</div>
							<div class="form-group mb-3">
								<label for="content" class="form-label">Pegawai</label>
								<select class="form-control" v-model="aktivasi.id_pegawai">
									<option v-for="pegawai in pegawais" :key="pegawai.id_pegawai"
										:value="pegawai.id_pegawai">{{
											pegawai.nama_pegawai }}</option>
								</select>
								<div v-if="validation.id_pegawai" class="mt-2 alert alert-danger">
									{{ validation.id_pegawai[0] }}
								</div>
							</div>
							<button type="submit" class="btn btn-primary">SIMPAN</button>
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
import { useToast } from "vue-toastification";
export default {
	setup() {
		//state aktivasi
		const aktivasis = reactive([]);
		const aktivasi = reactive({
			id_member: '',
			id_pegawai: '',
		});

		let members = ref([])
		onMounted(() => {
			//get API from Laravel Backend
			axios.get('https://gofit123.xyz/p3l_laravel/public/member')
				.then(response => {
					//assign state posts with response data
					members.value = response.data.data
				}).catch(error => {
					console.log(error.response.data)
				})
		})

		let pegawais = ref([])
		onMounted(() => {
			//get API from Laravel Backend
			axios.get('https://gofit123.xyz/p3l_laravel/public/pegawai')
				.then(response => {
					//assign state posts with response data
					pegawais.value = response.data.data
				}).catch(error => {
					console.log(error.response.data)
				})
		})

		//state validation
		const validation = ref([]);

		//vue router
		const router = useRouter();

		//method store
		function store() {
			let id_member = aktivasi.id_member
			let id_pegawai = aktivasi.id_pegawai
			let toast = useToast();

			axios.post("https://gofit123.xyz/p3l_laravel/public/aktivasi", {
				id_member: id_member,
				id_pegawai: id_pegawai
			}).then((response) => {
				console.log(response)
				let id_aktivasi = response.data.data.id_aktivasi;
				axios.get(`https://gofit123.xyz/p3l_laravel/public/aktivasi/${id_aktivasi}`)
					.then((response) => {
						console.log(response)
						aktivasis.push(response.data.data);
						if (aktivasis.length > 0) {
							console.log(aktivasis)
							const printContents = `
							<html>
							<head>
							<title>Struk Aktivasi</title>
							<style type="text/css">
								.card {
								width: 800px;
								height: auto;
								padding: 20px;
								margin: 50px auto;
								outline: 2px solid black; /* replace "border" with "outline" */
								text-align: left;
								}

								.card-title {
								margin-bottom: 5px;
								}

								.card .noStruk {
								float: right;
								}

								.card .tanggal {
								float: right;
								}

								.card .kasir {
								float: right;
								}
							</style>
							</head>
							<body>
							${aktivasis.map((aktivasi) => `
							<div class="card">
								<p>
								<span class="goFit"><b>GoFit</b></span>
								<span class="noStruk">No Struk : ${aktivasi.no_struk}</span>
								<br>
								<span>Jl. Qlipoth Tree No 5 Yogyakarta</span>
								<span class="tanggal">Tanggal : ${aktivasi.tanggal_aktivasi}</span>
								</p>
								<p class="card-text">
								<b>Member</b> : ${aktivasi.member_id} / ${aktivasi.nama_member}<br>
								Aktivasi Tahunan : Rp.${aktivasi.harga},- <br>
								Masa aktif member : ${aktivasi.masa_aktif}<br>
								<span class="kasir">Kasir: P${aktivasi.id_pegawai} / ${aktivasi.nama_pegawai}</span>
								</p>
							</div>
							`).join('')}
							</body>
							</html>`;
							const popup = window.open("", "_blank");
							popup.document.write(printContents);
							popup.document.close();
							popup.focus();
							popup.print();
							popup.close();
							aktivasis.length = 0
						}
					})
					.catch((error) => {
						console.log(error.response.data);
					});
				toast.success("Berhasil Register Instruktur !", {
					timeout: 2000
				})
			}).catch(error => {
				//assign state validation with error
				validation.value = error.response.data
			})
		}


		//return
		return {
			pegawais,
			members,
			aktivasi,
			aktivasis,
			validation,
			router,
			store,
		};
	},
};

</script>
<style>
.custom-text-field-height {
	height: 55px;
}
</style>
