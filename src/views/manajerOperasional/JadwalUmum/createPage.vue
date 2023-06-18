<template>
	<div class="container mt-5">
		<div class="row">
			<div class="col-md-12">
				<div class="card border-0 rounded shadow">
					<div class="card-body">
						<h4>TAMBAH JADWAL UMUM</h4>
						<hr />
						<form @submit.prevent="store">
							<div class="form-group mb-3">
								<label for="content" class="form-label">Tanggal</label>
								<select class="form-control" v-model="jadwalumum.hari">
									<option value="monday">Monday</option>
									<option value="tuesday">Tuesday</option>
									<option value="wednesday">Wednesday</option>
									<option value="thursday">Thursday</option>
									<option value="friday">Friday</option>
									<option value="saturday">Saturday</option>
									<option value="sunday">Sunday</option>
								</select>
								<div v-if="validation.hari" class="mt-2 alert alert-danger">
									{{ validation.hari[0] }}
								</div>
							</div>
							<div class="form-group mb-3">
								<label class="form-label">Kelas</label>
								<select class="form-control" v-model="jadwalumum.id_kelas">
									<option v-for="kelas in kelass" :key="kelas.id_kelas" :value="kelas.id_kelas">{{
										kelas.nama_kelas }}</option>
								</select>
								<div v-if="validation.nama_kelas" class="mt-2 alert alert-danger">
									{{ validation.umur[0] }}
								</div>
							</div>
							<div class="form-group mb-3">
								<label class="form-label">Nama Instruktur</label>
								<select class="form-control" v-model="jadwalumum.id_instruktur">
									<option v-for="instruktur in instrukturs" :key="instruktur.id_instruktur"
										:value="instruktur.id_instruktur">{{
											instruktur.nama_instruktur }}</option>
								</select>
								<div v-if="validation.nama_kelas" class="mt-2 alert alert-danger">
									{{ validation.umur[0] }}
								</div>
							</div>
							<div class="form-group mb-3">
								<label class="form-label">Jam</label>
								<input type="time" class="form-control" v-model="jadwalumum.jam"
									placeholder="Masukkan Jam" />
								<!-- validation -->
								<div v-if="validation.password" class="mt-2 alert alert-danger">
									{{ validation.password[0] }}
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
		//state instruktur
		const jadwalumum = reactive({
			hari: "",
			id_kelas: "",
			id_instruktur: "",
			jam: "",
		});
		//state validation
		const validation = ref([]);

		// const insOptions = ref([]);
		//vue router
		const router = useRouter();

		let kelass = ref([])
		onMounted(() => {
			//get API from Laravel Backend
			axios.get('https://gofit123.xyz/p3l_laravel/public/kelas')
				.then(response => {
					//assign state posts with response data
					kelass.value = response.data.data
				}).catch(error => {
					console.log(error.response.data)
				})
		})

		let instrukturs = ref([])
		onMounted(() => {
			//get API from Laravel Backend
			axios.get('https://gofit123.xyz/p3l_laravel/public/instruktur')
				.then(response => {
					//assign state posts with response data
					instrukturs.value = response.data.data
				}).catch(error => {
					console.log(error.response.data)
				})
		})


		//method store
		function store() {
			let hari = jadwalumum.hari
			let id_kelas = jadwalumum.id_kelas
			let id_instruktur = jadwalumum.id_instruktur
			let jam = jadwalumum.jam

			let toast = useToast();

			axios.post("https://gofit123.xyz/p3l_laravel/public/jadwalUmum", {
				hari: hari,
				id_kelas: id_kelas,
				id_instruktur: id_instruktur,
				jam: jam
			}).then(() => {
				toast.success("Berhasil Menambah Jadwal Umum !", {
					timeout: 2000
				})
				router.push({
					name: "mo.jadwalUmum.index",
				});
			})
				.catch((error) => {
					console.log(error.response.data);
					validation.value = error.response.data.data;
				});
		}

		return {
			jadwalumum,
			validation,
			router,
			kelass,
			instrukturs,
			store,

		};
	},
};

</script>
<style></style>
