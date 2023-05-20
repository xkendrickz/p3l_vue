<template>
	<div class="container mt-5">
		<div class="row">
			<div class="col-md-12">
				<div class="card border-0 rounded shadow">
					<div class="card-body">
						<h4>DEPOSIT KELAS</h4>
						<hr />
						<form @submit.prevent="store">
							<div class="form-group mb-3">
								<label for="content" class="form-label">Member</label>
								<select class="form-control" v-model="depositKelas.id_member">
									<option v-for="member in members" :key="member.id_member" :value="member.id_member">
										{{ member.nama_member }}</option>
								</select>
								<div v-if="validation.id_member" class="mt-2 alert alert-danger">
									{{ validation.id_member[0] }}
								</div>
							</div>
							<div class="form-group mb-3">
								<label for="content" class="form-label">Pegawai</label>
								<select class="form-control" v-model="depositKelas.id_pegawai">
									<option v-for="pegawai in pegawais" :key="pegawai.id_pegawai"
										:value="pegawai.id_pegawai">{{
											pegawai.nama_pegawai }}</option>
								</select>
								<div v-if="validation.id_pegawai" class="mt-2 alert alert-danger">
									{{ validation.id_pegawai[0] }}
								</div>
							</div>
							<div class="form-group mb-3">
								<label for="content" class="form-label">Kelas</label>
								<select class="form-control" v-model="depositKelas.id_kelas">
									<option v-for="kelas in kelass" :key="kelas.id_kelas" :value="kelas.id_kelas">{{
										kelas.nama_kelas }}</option>
								</select>
								<div v-if="validation.id_kelas" class="mt-2 alert alert-danger">
									{{ validation.id_kelas[0] }}
								</div>
							</div>
							<div class="form-group mb-3">
								<label for="content" class="form-label">Deposit</label>
								<select class="form-select" v-model="depositKelas.deposit"
									placeholder="Pilih jumlah deposit">
									<option value="5">5</option>
									<option value="10">10</option>
								</select>
								<div v-if="validation.deposit" class="mt-2 alert alert-danger">
									{{ validation.deposit[0] }}
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
		const depositKelass = reactive([]);
		const depositKelas = reactive({
			id_member: '',
			id_pegawai: '',
			id_kelas: '',
			deposit: '',
		});

		let members = ref([])
		onMounted(() => {
			//get API from Laravel Backend
			axios.get('http://192.168.1.32:8000/api/member')
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
			axios.get('http://192.168.1.32:8000/api/pegawai')
				.then(response => {
					//assign state posts with response data
					pegawais.value = response.data.data
				}).catch(error => {
					console.log(error.response.data)
				})
		})

		let kelass = ref([])
		onMounted(() => {
			//get API from Laravel Backend
			axios.get('http://192.168.1.32:8000/api/kelas')
				.then(response => {
					//assign state posts with response data
					kelass.value = response.data.data
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
			let id_member = depositKelas.id_member
			let id_pegawai = depositKelas.id_pegawai
			let id_kelas = depositKelas.id_kelas
			let deposit = depositKelas.deposit
			let toast = useToast();

			axios.post("http://192.168.1.32:8000/api/depositKelas", {
				id_member: id_member,
				id_pegawai: id_pegawai,
				id_kelas: id_kelas,
				deposit: deposit
			})
				.then((response) => {
					console.log()
					let id_deposit = response.data.data.id_deposit_paket;
					axios.get(`http://192.168.1.32:8000/api/depositReguler/${id_deposit}`)
						.then((response) => {
							depositKelass.push(response.data.data);
							if (depositKelass.length > 0) {
								console.log(depositKelass)
								const printContents = `
									<html>
									<head>
										<title>Struk Deposit Kelas</title>
										<style type="text/css">
										.card {
											width: 300px;
											height: 300px;
											padding: 20px;
											margin: 50px auto;
											outline: 2px solid black; /* replace "border" with "outline" */
											text-align: left;
										}
										</style>
									</head>
									<body>
										<div class="card">
											<h5 class="card-title"><strong>GoFit</strong></h5>
											<p>Jl. Qlipoth Tree No 5 Yogyakarta</p>

											<h5 class="card-title"><strong>MEMBER CARD</strong></h5>
											${depositKelass.map((depositKelas) => `
												<p class="card-text">
													No Struk : ${depositKelas.no_struk}<br>
													Tanggal : ${depositKelas.tanggal_aktivasi}<br>
													Member : ${depositKelas.member_id} / ${depositKelas.nama_member}<br>
													Deposit : Rp.${depositKelas.harga},-<br>
													Jenis Kelas: ${depositKelas.nama_kelas}<br>
													Total Deposit: ${depositKelas.jumlah_deposit_kelas}<br>
													Total Deposit: ${depositKelas.jumlah_deposit_kelas}<br>
													Berlaku sampai dengan : ${depositKelas.berlaku_sampai}<br>
													Kasir: P${depositKelas.id_pegawai} / ${depositKelas.nama_pegawai}
												</p>
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
								depositKelass.length = 0
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
			kelass,
			depositKelas,
			depositKelass,
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
