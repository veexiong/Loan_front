<template>
  <v-container fluid class="pa-0">
    <div class="d-flex flex-column flex-sm-row justify-space-between align-center mb-6 gap-3">
      <h2 class="text-h6 text-sm-h5 font-weight-bold text-indigo-darken-3 text-center text-sm-left mb-3 mb-sm-0">
        <v-icon color="amber-darken-2" class="me-2 pb-1">mdi-star-circle</v-icon> ລະບົບສິນເຊື່ອຂັ້ນສູງ (Pro Loans)
      </h2>
      <div class="d-flex flex-wrap justify-center gap-2">
        <v-btn color="green-darken-2" prepend-icon="mdi-chart-box" @click="openReportDialog" class="rounded-lg font-weight-bold" elevation="2">
          ເບິ່ງລາຍງານ
        </v-btn>
        <v-btn color="indigo-darken-3" prepend-icon="mdi-plus" @click="showCreateDialog = true" class="rounded-lg font-weight-bold" elevation="2">
          ສ້າງສັນຍາໃໝ່
        </v-btn>
      </div>
    </div>

    <!-- Stats / NPL Tracker -->
    <v-row class="mb-6">
      <v-col cols="12" sm="4">
        <v-card class="rounded-xl elevation-3 stat-card glass-card" style="border-left: 5px solid #3949ab">
          <v-card-text class="d-flex align-center pa-5">
            <v-avatar color="indigo-lighten-4" size="56" class="me-4 rounded-lg">
              <v-icon color="indigo-darken-3" size="32">mdi-file-document-multiple</v-icon>
            </v-avatar>
            <div>
              <div class=" text-grey-darken-1 text-uppercase font-weight-bold tracking-widest">ສັນຍາທີ່ກຳລັງດຳເນີນ</div>
              <div class="text-h3 font-weight-black text-indigo-darken-4 mt-1">{{ activeCount }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="rounded-xl elevation-3 stat-card glass-card" style="border-left: 5px solid #e53935">
          <v-card-text class="d-flex align-center pa-5">
            <v-avatar color="red-lighten-4" size="56" class="me-4 rounded-lg">
              <v-icon color="red-darken-3" size="32">mdi-alert-circle</v-icon>
            </v-avatar>
            <div>
              <div class=" text-red-darken-2 text-uppercase font-weight-bold tracking-widest">ສັນຍາຄ້າງຊຳລະ (NPL)</div>
              <div class="text-h3 font-weight-black text-red-darken-4 mt-1">{{ nplCount }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="rounded-xl elevation-3 stat-card glass-card" style="border-left: 5px solid #43a047">
          <v-card-text class="d-flex align-center pa-5">
            <v-avatar color="green-lighten-4" size="56" class="me-4 rounded-lg">
              <v-icon color="green-darken-3" size="32">mdi-check-circle</v-icon>
            </v-avatar>
            <div>
              <div class=" text-green-darken-2 text-uppercase font-weight-bold tracking-widest">ສັນຍາທີ່ປິດຍອດແລ້ວ</div>
              <div class="text-h3 font-weight-black text-green-darken-4 mt-1">{{ completedCount }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Loan List -->
    <v-card class="rounded-xl elevation-3 glass-card pa-2 mb-8">
      <v-data-table
        :headers="headers"
        :items="loans"
        :loading="loading"
        hover
        class="custom-table"
      >
        <template v-slot:item.b_name="{ item }">
          <div class="d-flex align-center">
            <span>{{ item.b_name }}</span>
            <v-badge
              v-if="item.alert_schedules_count > 0"
              color="error"
              :content="item.alert_schedules_count"
              inline
              class="ms-1 font-weight-bold"
            ></v-badge>
          </div>
        </template>
        <template v-slot:item.status_display="{ item }">
          <v-chip
            :color="getStatusColor(item.status_display)"
            size="small"
            class="font-weight-bold text-uppercase"
          >
            {{ getStatusText(item.status_display) }}
          </v-chip>
        </template>
        <template v-slot:item.principal="{ item }">
          <span class="font-weight-medium">{{ formatCurrency(item.principal) }} ₭</span>
        </template>
        <template v-slot:item.interest_rate="{ item }">
          <span>{{ item.interest_rate }}% ({{ item.interest_type === 'flat' ? 'ຄົງທີ່' : 'ຫຼຸດຕົ້ນຫຼຸດດອກ' }})</span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon size="small" color="indigo" variant="text" @click="viewLoan(item)">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Create Loan Dialog -->
    <v-dialog v-model="showCreateDialog" max-width="800" transition="dialog-bottom-transition">
      <v-card class="rounded-xl shadow-lg border-0 overflow-hidden">
        <v-card-title class="gradient-header pa-5 d-flex align-center">
          <v-avatar color="white" size="40" class="me-3">
            <v-icon color="indigo-darken-3">mdi-file-document-edit</v-icon>
          </v-avatar>
          <span class="   font-weight-bold">ສ້າງສັນຍາເງິນກູ້ໃໝ່</span>
          <v-spacer></v-spacer>
          <v-btn icon variant="tonal" color="white" @click="showCreateDialog = false" size="small"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-card-text class="pa-6 bg-grey-lighten-5">
          <v-row>
            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="newLoan.borrower_id"
                :items="borrowers"
                item-title="b_name"
                item-value="b_id"
                label="ເລືອກຜູ້ກູ້"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-account"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="newLoan.principal"
                label="ຍອດເງິນກູ້ (ເງິນຕົ້ນ)"
                type="number"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-cash"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="newLoan.interest_rate"
                label="ດອກເບ້ຍ (%) ຕໍ່ງວດ"
                type="number"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-percent"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="newLoan.interest_type"
                :items="[{title:'ດອກເບ້ຍຄົງທີ່ (Flat)', value:'flat'}, {title:'ຫຼຸດຕົ້ນຫຼຸດດອກ (Effective)', value:'effective'}]"
                label="ປະເພດດອກເບ້ຍ"
                variant="outlined"
                density="comfortable"
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="newLoan.term_months"
                label="ຈຳນວນງວດ"
                type="number"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-calendar-month"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="newLoan.start_date"
                label="ວັນທີເລີ່ມສັນຍາ"
                type="date"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Amortization Preview Alert -->
          <v-alert
            v-if="newLoan.principal && newLoan.interest_rate && newLoan.term_months"
            color="info"
            variant="tonal"
            class="mt-4"
          >
            <div class="d-flex align-center">
              <v-icon class="me-2">mdi-calculator</v-icon>
              <div>
                <strong>ພຣີວິວຄ່າງວດໂດຍປະມານ: </strong>
                <span v-if="newLoan.interest_type === 'flat'">
                  {{ formatCurrency((Number(newLoan.principal) / Number(newLoan.term_months)) + (Number(newLoan.principal) * (Number(newLoan.interest_rate)/100))) }} ₭ / ງວດ
                </span>
                <span v-else>ແບບຫຼຸດຕົ້ນຫຼຸດດອກ ຄ່າງວດຈະຫຼຸດລົງເລື້ອຍໆ</span>
              </div>
            </div>
          </v-alert>

        </v-card-text>
        <v-card-actions class="pa-4 bg-grey-lighten-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showCreateDialog = false">ຍົກເລີກ</v-btn>
          <v-btn color="indigo-darken-3" variant="flat" @click="submitLoan" :loading="saving">ບັນທຶກສັນຍາ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Loan Detail & Print Dialog -->
    <v-dialog v-model="showDetailDialog" max-width="1000" fullscreen scrollable class="pa-md-4" transition="dialog-bottom-transition">
      <v-card class="rounded-xl shadow-lg border-0 overflow-hidden" v-if="selectedLoan">
        <v-card-title class="gradient-header pa-4 d-flex flex-wrap align-center shadow-sm z-10 gap-2" style="position: relative;">
          <v-avatar color="white" size="40" class="me-2 d-none d-sm-flex">
            <v-icon color="indigo-darken-3">mdi-file-document</v-icon>
          </v-avatar>
          <span class=" font-weight-bold">ລາຍລະອຽດສັນຍາ #{{ String(selectedLoan.id).padStart(5, '0') }}</span>
          <v-spacer></v-spacer>
          <div class="d-flex align-center">
            <v-btn variant="tonal" color="white" class="me-2 rounded-lg" size="small" @click="exportToPDF" prepend-icon="mdi-file-pdf-box">ບັນທືກເປັນ(PDF)</v-btn>
            <v-btn variant="tonal" color="white" class="me-2 rounded-lg d-none d-sm-flex" size="small" @click="exportToImage" prepend-icon="mdi-image">ບັນທືກເປັນ(ຮູບພາບ)</v-btn>
            <v-btn icon variant="tonal" @click="promptDeleteLoan" title="ລຶບສັນຍາ" color="red-lighten-4" size="small" class="me-2"><v-icon color="red-lighten-1">mdi-delete</v-icon></v-btn>
            <v-btn icon variant="tonal" color="white" @click="showDetailDialog = false" size="small"><v-icon>mdi-close</v-icon></v-btn>
          </div>
        </v-card-title>
        
        <v-card-text class="pt-0 px-0 pb-16 bg-grey-lighten-3">
          <div id="loan-document" class="bg-white mx-auto my-6 pa-8 pa-md-12 elevation-4" style="max-width: 900px; border-radius: 16px;">
            <!-- Contract Header -->
            <div class="text-center mb-8">
              <h1 class="font-weight-bold text-indigo-darken-4 mb-2" style="font-size: 25px;">ສັນຍາເງິນກູ້</h1>
              <p class=" text-grey-darken-1">ເລກທີສັນຍາ: {{ String(selectedLoan.id).padStart(5, '0') }}</p>
            </div>
            
            <v-row class="mb-6 border-b pb-6">
              <v-col cols="6">
                <div class=" text-grey">ຂໍ້ມູນຜູ້ກູ້ຢືມ</div>
                <div class="font-weight-bold ">{{ selectedLoan.b_name }}</div>
                <div>ໂທ: {{ selectedLoan.b_number }}</div>
                <div>ທີ່ຢູ່: {{ selectedLoan.b_address }}</div>
              </v-col>
              <v-col cols="6" class="text-end">
                <div class=" text-grey">ລາຍລະອຽດສັນຍາ</div>
                <div class="font-weight-bold ">ຍອດກູ້: {{ formatCurrency(selectedLoan.principal) }} ₭</div>
                <div>ດອກເບ້ຍ: {{ selectedLoan.interest_rate }}% ({{ selectedLoan.interest_type === 'flat' ? 'ຄົງທີ່' : 'ຫຼຸດຕົ້ນຫຼຸດດອກ' }})</div>
                <div>ຈຳນວນງວດ: {{ selectedLoan.term_months }} ງວດ</div>
                <div>ວັນທີເລີ່ມ: {{ formatDateNumeric(selectedLoan.start_date) }}</div>
              </v-col>
            </v-row>

            <!-- Amortization Table -->
            <div class="mt-6 mb-8 overflow-x-auto">
              <h3 class=" font-weight-bold mb-4 text-indigo-darken-4 border-b pb-2"style="font-size: 20px;">ຕາຕະລາງຜ່ອນຊຳລະ</h3>
              <v-table class="custom-table border" style="min-width: 700px;">
                <thead>
                  <tr class="bg-indigo-lighten-5">
                    <th class="font-weight-bold text-indigo-darken-4">ງວດທີ</th>
                    <th class="font-weight-bold text-indigo-darken-4">ວັນທີຄົບກຳນົດ</th>
                    <th class="font-weight-bold text-end text-indigo-darken-4">ເງິນຕົ້ນ</th>
                    <th class="font-weight-bold text-end text-indigo-darken-4">ດອກເບ້ຍ</th>
                    <th class="font-weight-bold text-end text-indigo-darken-4">ລວມຕ້ອງຈ່າຍ</th>
                    <th class="font-weight-bold text-center text-indigo-darken-4">ສະຖານະ</th>
                    <th class="font-weight-bold text-center text-indigo-darken-4" data-html2canvas-ignore>ຈັດການ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="sch in selectedLoan.schedules" :key="sch.id" :class="{'bg-red-lighten-5': isOverdue(sch) && sch.status !== 'paid'}">
                  <td>{{ sch.installment_no }}</td>
                  <td :class="getDueDateColorClass(sch)">{{ formatDateNumeric(sch.due_date) }}</td>
                  <td class="text-end">{{ formatCurrency(sch.principal_due) }} ₭</td>
                  <td class="text-end">{{ formatCurrency(sch.interest_due) }} ₭</td>
                  <td class="text-end font-weight-bold">{{ formatCurrency(sch.total_due) }} ₭</td>
                  <td class="text-center">
                    <v-chip :color="sch.status === 'paid' ? 'success' : (isOverdue(sch) ? 'error' : 'warning')" size="small" variant="flat" class="font-weight-bold px-3 text-white">
                      <v-icon start size="small" class="me-1">
                        {{ sch.status === 'paid' ? 'mdi-check-circle' : (isOverdue(sch) ? 'mdi-alert-circle' : 'mdi-clock-outline') }}
                      </v-icon>
                      {{ sch.status === 'paid' ? 'ຈ່າຍແລ້ວ' : (isOverdue(sch) ? 'ຄ້າງຊຳລະ' : 'ລໍຖ້າຊຳລະ') }}
                    </v-chip>
                  </td>
                  <td class="text-center" data-html2canvas-ignore>
                    <v-btn v-if="sch.status !== 'paid'" size="x-small" color="indigo" variant="flat" @click="openPayDialog(sch)">ຮັບຊຳລະ</v-btn>
                    <div v-else class="d-flex align-center justify-center">
                      <span class="text-caption text-green me-1">
                        <v-icon size="small">mdi-check-all</v-icon> {{ formatDateNumeric(sch.paid_date) }}
                      </span>
                      <v-btn icon size="x-small" variant="text" color="indigo" @click="printPaymentBill(sch, selectedLoan, sch.penalty_paid || 0)" title="ພິມໃບບິນຍ້ອນຫຼັງ">
                        <v-icon>mdi-printer</v-icon>
                      </v-btn>
                    </div>
                  </td>
                </tr>
              </tbody>
            </v-table>
            </div>
            
            <!-- Collaterals Section -->
            <div class="mt-8 border-t pt-6 mb-6">
              <div class="d-flex justify-space-between align-center mb-4">
                <h3 class="font-weight-bold" style="font-size: 19px;">ຫຼັກຊັບຄ້ຳປະກັນ</h3>
                <v-btn size="small" color="indigo" prepend-icon="mdi-plus" @click="showCollateralForm = !showCollateralForm" variant="outlined" data-html2canvas-ignore>
                  ເພີ່ມຫຼັກຊັບ
                </v-btn>
              </div>

              <!-- Add Collateral Form -->
              <v-expand-transition data-html2canvas-ignore>
                <v-card v-if="showCollateralForm" class="bg-indigo-lighten-5 mb-4 pa-4 rounded-lg elevation-0 border">
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-select v-model="newCollateral.type" :items="['ລົດໃຫຍ່', 'ລົດຈັກ', 'ທີ່ດິນ', 'ບຸກຄົນຄ້ຳປະກັນ', 'ອື່ນໆ']" label="ປະເພດ" variant="outlined" density="compact" hide-details></v-select>
                    </v-col>
                    
                    <!-- Standard Collateral Fields -->
                    <template v-if="newCollateral.type !== 'ບຸກຄົນຄ້ຳປະກັນ'">
                      <v-col cols="12" md="8">
                        <v-text-field v-model="newCollateral.description" label="ລາຍລະອຽດ (ຍີ່ຫໍ້, ທະບຽນ, ເລກທີດິນ...)" variant="outlined" density="compact" hide-details></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field v-model="newCollateral.estimated_value" label="ລາຄາປະເມີນ (₭)" type="number" variant="outlined" density="compact" hide-details></v-text-field>
                      </v-col>
                    </template>
                    
                    <!-- Guarantor Fields -->
                    <template v-else>
                      <v-col cols="12" md="4">
                        <v-text-field v-model="newCollateral.guarantor_name" label="ຊື່ ແລະ ນາມສະກຸນ" variant="outlined" density="compact" hide-details></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field v-model="newCollateral.guarantor_dob" label="ວັນເດືອນປີເກີດ" type="date" variant="outlined" density="compact" hide-details></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="newCollateral.guarantor_id" label="ເລກບັດປະຈຳຕົວ / ສຳມະໂນຄົວ" variant="outlined" density="compact" hide-details></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="newCollateral.guarantor_address" label="ທີ່ຢູ່ປັດຈຸບັນ" variant="outlined" density="compact" hide-details></v-text-field>
                      </v-col>
                    </template>
                    <v-col cols="12" md="8">
                      <v-file-input v-model="newCollateral.files" label="ອັບໂຫຼດໄຟລ໌ / ຮູບພາບ" variant="outlined" density="compact" hide-details multiple show-size prepend-inner-icon="mdi-file-upload" prepend-icon=""></v-file-input>
                    </v-col>
                    <v-col cols="12" md="6" class="d-flex align-center justify-end">
                      <v-btn color="grey" variant="text" @click="showCollateralForm = false" class="me-2">ຍົກເລີກ</v-btn>
                      <v-btn color="indigo-darken-3" variant="flat" @click="submitCollateral" :loading="savingCollateral">ບັນທຶກ</v-btn>
                    </v-col>
                  </v-row>
                </v-card>
              </v-expand-transition>

              <!-- Collateral List -->
              <div class="overflow-x-auto">
                <v-table density="compact" class="border" style="min-width: 500px;">
                <thead>
                  <tr class="bg-grey-lighten-4">
                    <th class="font-weight-bold">ປະເພດ</th>
                    <th class="font-weight-bold">ລາຍລະອຽດ</th>
                    <th class="font-weight-bold text-end">ລາຄາປະເມີນ</th>
                    <th class="font-weight-bold text-center">ໄຟລ໌ແນບ</th>
                    <th class="font-weight-bold text-center" data-html2canvas-ignore>ລຶບ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="!selectedLoan.collaterals || selectedLoan.collaterals.length === 0">
                    <td colspan="5" class="text-center text-grey">ບໍ່ມີຂໍ້ມູນຫຼັກຊັບຄ້ຳປະກັນ</td>
                  </tr>
                  <tr v-for="col in selectedLoan.collaterals" :key="col.id">
                    <td>{{ col.type }}</td>
                    <td style="line-height: 1.6; padding-top: 8px; padding-bottom: 8px;">
                      <span v-html="formatCollateralDescription(col.description, col.type)"></span>
                    </td>
                    <td class="text-end">
                      <span v-if="col.type === 'ບຸກຄົນຄ້ຳປະກັນ'">-</span>
                      <span v-else>{{ formatCurrency(col.estimated_value) }} ₭</span>
                    </td>
                    <td class="text-center">
                      <div v-if="col.image_url">
                        <template v-for="(file, index) in parseFiles(col.image_url)" :key="index">
                          <v-btn icon size="x-small" color="indigo" variant="text" :href="apiBase + file" target="_blank" class="mx-1" title="ເປີດໄຟລ໌">
                            <v-icon>mdi-file-document-outline</v-icon>
                          </v-btn>
                        </template>
                      </div>
                      <span v-else class="text-grey text-caption">-</span>
                    </td>
                    <td class="text-center" data-html2canvas-ignore>
                      <v-btn icon size="x-small" color="red" variant="text" @click="promptDeleteCollateral(col.id)"><v-icon>mdi-delete</v-icon></v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
              </div>
            </div>
            <!-- Images Attachment Section -->
            <div v-if="hasImages(selectedLoan)" class="mt-8 pt-4">
               <div class="d-flex align-center mb-4">
                 <h3 class="font-weight-bold mb-0" style="font-size: 19px;">ເອກະສານຊ້ອນທ້າຍ / ຮູບພາບ</h3>
                 <v-btn variant="tonal" size="small" class="ms-4 rounded-pill d-print-none font-weight-bold" data-html2canvas-ignore @click="showImagesInView = !showImagesInView" :color="showImagesInView ? 'indigo' : 'grey-darken-2'">
                   <v-icon start color="blue">{{ showImagesInView ? 'mdi-eye-off' : 'mdi-image-multiple' }}</v-icon>
                   {{ showImagesInView ? 'ເຊື່ອງເອກະສານໄວ້' : 'ສະແດງເອກະສານຊ້ອນທ້າຍ' }}
                 </v-btn>
               </div>
               <v-row v-show="showImagesInView">
                 <template v-for="col in selectedLoan.collaterals" :key="'img-'+col.id">
                   <template v-for="(file, index) in parseFiles(col.image_url)" :key="index">
                     <v-col cols="12" v-if="isImage(file)" class="mb-4">
                       <v-card class="border pa-4 elevation-0 text-center bg-grey-lighten-5">
                         <img :src="apiBase + file" style="max-width: 100%; max-height: 700px; object-fit: contain; border-radius: 8px;" />
                         <!-- <div class="text-subtitle-1 font-weight-bold mt-3 text-indigo-darken-4">{{ col.type }}</div> -->
                       </v-card>
                     </v-col>
                   </template>
                 </template>
               </v-row>
            </div>

            <!-- Signatures -->
            <v-row class="mt-12 pt-8">
              <v-col :cols="hasGuarantor(selectedLoan) ? 4 : 6" class="text-center">
                <!-- <div class="border-b mx-auto mb-2" style="height: 40px; width: 80%;"></div> -->
                <div>ຜູ້ໃຫ້ກູ້ / ຜູ້ຮັບເງິນ</div>
                <div class="mt-1">({{ userName }})</div>
              </v-col>
              <v-col v-if="hasGuarantor(selectedLoan)" cols="4" class="text-center">
                <!-- <div class="border-b mx-auto mb-2" style="height: 40px; width: 80%;"></div> -->
                <div>ຜູ້ຄ້ຳປະກັນ</div>
                <div class="mt-1 ">({{ getGuarantorName(selectedLoan) }})</div>
              </v-col>
              <v-col :cols="hasGuarantor(selectedLoan) ? 4 : 6" class="text-center">
                <!-- <div class="border-b mx-auto mb-2" style="height: 40px; width: 80%;"></div> -->
                <div>ຜູ້ກູ້ຢືມ / ຜູ້ຈ່າຍເງິນ</div>
                <div class="mt-1">({{ selectedLoan.b_name }})</div>
              </v-col>
            </v-row>
            <div style="height: 50px;"></div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete Collateral Confirm Dialog -->
    <v-dialog v-model="showDeleteCollateralDialog" max-width="400">
      <v-card class="rounded-xl shadow-lg border-0">
        <v-card-title class="gradient-header pa-4 d-flex align-center">
          <v-avatar color="white" size="36" class="me-3">
            <v-icon color="red-darken-2" size="20">mdi-alert</v-icon>
          </v-avatar>
          <span class="font-weight-bold" style="font-size: 18px;">ຢືນຢັນການລຶບ</span>
        </v-card-title>
        <v-card-text class="pa-6 bg-grey-lighten-5 text-center" style="font-size: 18px;">
          ທ່ານຕ້ອງການລຶບຫຼັກຊັບນີ້ແທ້ບໍ່?
        </v-card-text>
        <v-card-actions class="pa-4 bg-white border-t">
          <v-btn variant="flat" color="grey-darken-2" @click="showDeleteCollateralDialog = false" class="font-weight-bold">ຍົກເລີກ</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red-darken-2" variant="flat" @click="confirmDeleteCollateral" :loading="deletingCollateral" class="rounded-lg px-6 font-weight-bold">ຢືນຢັນລຶບ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Loan Confirm Dialog -->
    <v-dialog v-model="showDeleteLoanDialog" max-width="400">
      <v-card class="rounded-xl shadow-lg border-0">
        <v-card-title class="gradient-header pa-4 d-flex align-center">
          <v-avatar color="white" size="36" class="me-3">
            <v-icon color="red-darken-2" size="20">mdi-alert</v-icon>
          </v-avatar>
          <span class="font-weight-bold" style="font-size: 18px;">ຢືນຢັນການລຶບສັນຍາ</span>
        </v-card-title>
        <v-card-text class="pa-6 bg-grey-lighten-5 text-center" style="font-size: 18px;">
          ທ່ານຕ້ອງການລຶບສັນຍານີ້ແທ້ບໍ່? ການກະທຳນີ້ບໍ່ສາມາດແກ້ໄຂໄດ້!
        </v-card-text>
        <v-card-actions class="pa-4 bg-white border-t">
          <v-btn variant="flat" color="grey-darken-2" @click="showDeleteLoanDialog = false" class="font-weight-bold">ຍົກເລີກ</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red-darken-2" variant="flat" @click="confirmDeleteLoan" :loading="deletingLoan" class="rounded-lg px-6 font-weight-bold">ຢືນຢັນລຶບ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Payment Dialog -->
    <v-dialog v-model="showPayDialog" max-width="400" transition="dialog-bottom-transition">
      <v-card class="rounded-xl shadow-lg border-0">
        <v-card-title class="gradient-header pa-4 d-flex align-center">
          <v-avatar color="white" size="36" class="me-3">
            <v-icon color="indigo-darken-3" size="20">mdi-cash-check</v-icon>
          </v-avatar>
          <span class=" font-weight-bold" style="font-size: 18px;">ຮັບຊຳລະຄ່າງວດທີ {{ payingSchedule?.installment_no }}</span>
        </v-card-title>
        <v-card-text class="pa-6 bg-grey-lighten-5">
          <div class="mb-6 bg-white pa-4 rounded-lg border text-center">
            <div class="text-grey-darken-1 text-uppercase font-weight-bold mb-1">ຍອດທີ່ຕ້ອງຊຳລະປົກກະຕິ</div>
            <div class="text-h4 font-weight-black text-indigo-darken-4">{{ formatCurrency(payingSchedule?.total_due) }} <span class="text-h6">₭</span></div>
          </div>
          <v-text-field
            v-model="penaltyFee"
            label="ຄ່າປັບໃໝລ່າຊ້າ (₭)"
            type="number"
            variant="outlined"
            density="comfortable"
            bg-color="white"
            hint="ປ່ອຍຫວ່າງໄວ້ຖ້າບໍ່ມີຄ່າປັບໃໝ"
            prepend-inner-icon="mdi-alert-circle-outline"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="pa-4 bg-white border-t">
          <v-spacer></v-spacer>
          <v-btn variant="text" color="grey-darken-2" @click="showPayDialog = false" class="font-weight-bold">ຍົກເລີກ</v-btn>
          <v-btn color="indigo-darken-3" variant="flat" @click="confirmPayment" :loading="savingPayment" class="rounded-lg px-6 font-weight-bold">ຢືນຢັນການຮັບຊຳລະ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Report Dialog -->
    <v-dialog v-model="showReportDialog" max-width="1100" transition="dialog-bottom-transition" fullscreen class="pa-md-4">
      <v-card class="rounded-xl shadow-lg border-0 bg-grey-lighten-4">
        <v-card-title class="gradient-report pa-4 pa-sm-5 d-flex flex-wrap align-center shadow-sm z-10 gap-2" style="position: relative;">
          <v-avatar color="white" size="48" class="me-3 d-none d-sm-flex">
            <v-icon color="green-darken-3" size="28">mdi-chart-line</v-icon>
          </v-avatar>
          <span class="font-weight-black tracking-tight" style="font-size:24px">ສະຫຼຸບລາຍງານ (Pro Loans Report)</span>
          <v-spacer></v-spacer>
          <div class="d-flex align-center">
            <v-btn variant="tonal" color="white" class="me-2 rounded-lg font-weight-bold" size="small" @click="exportReportToPDF" prepend-icon="mdi-file-pdf-box">ບັນທືກເປັນ(PDF)</v-btn>
            <v-btn icon variant="tonal" color="white" @click="showReportDialog = false" size="small"><v-icon>mdi-close</v-icon></v-btn>
          </div>
        </v-card-title>
        <v-card-text class="pa-4 pa-md-8">
          <div id="report-print-area">
          <v-row v-if="reportData" class="mb-6">
            <v-col cols="6" sm="6" md="3">
              <v-card class="rounded-xl stat-card border-0 h-100 bg-white d-flex flex-column justify-center align-center py-4 py-md-6">
                <v-avatar color="grey-lighten-4" size="48" class="mb-2"><v-icon color="yellow-darken-3" size="28">mdi-file-document-multiple</v-icon></v-avatar>
                <div class="text-grey-darken-1 text-uppercase font-weight-bold">ຈຳນວນສັນຍາທັງໝົດ</div>
                <div class="font-weight-black mt-1" style="font-size: 20px;">{{ reportData.total_loans }} ສັນຍາ</div>
              </v-card>
            </v-col>
            <v-col cols="6" sm="4" md="2">
              <v-card class="rounded-xl stat-card border-0 h-100 bg-white d-flex flex-column justify-center align-center py-4 py-md-6" style="border-bottom: 4px solid #1565c0 !important">
                <v-avatar color="blue-lighten-5" size="48" class="mb-2"><v-icon color="blue-darken-3" size="28">mdi-cash-multiple</v-icon></v-avatar>
                <div class=" text-grey-darken-1 text-uppercase font-weight-bold">ຍອດປ່ອຍກູ້</div>
                <div class="      font-weight-black text-blue-darken-3 mt-1">{{ formatCurrency(reportData.total_principal_disbursed) }} ₭</div>
              </v-card>
            </v-col>
            <v-col cols="6" sm="4" md="3">
              <v-card class="rounded-xl stat-card border-0 h-100 bg-white d-flex flex-column justify-center align-center py-4 py-md-6" style="border-bottom: 4px solid #6a1b9a !important">
                <v-avatar color="purple-lighten-5" size="48" class="mb-2"><v-icon color="purple-darken-3" size="28">mdi-calculator</v-icon></v-avatar>
                <div class="  text-grey-darken-1 text-uppercase font-weight-bold">ຍອດຕ້ອງຮັບ</div>
                <div class="      font-weight-black text-purple-darken-3 mt-1">{{ formatCurrency(reportData.total_principal_disbursed + reportData.total_interest_expected) }} ₭</div>
              </v-card>
            </v-col>
            <v-col cols="6" sm="4" md="2">
              <v-card class="rounded-xl stat-card border-0 h-100 bg-white d-flex flex-column justify-center align-center py-4 py-md-6">
                <v-avatar color="teal-lighten-5" size="48" class="mb-2"><v-icon color="teal-darken-3" size="28">mdi-cash-register</v-icon></v-avatar>
                <div class="  text-grey-darken-1 text-uppercase font-weight-bold">ຍອດຮັບແລ້ວ</div>
                <div class="      font-weight-black text-teal-darken-3 mt-1">{{ formatCurrency(reportData.total_collected + reportData.total_penalty) }} ₭</div>
              </v-card>
            </v-col>
            <v-col cols="6" sm="6" md="3">
              <v-card class="rounded-xl stat-card border-0 h-100 bg-white d-flex flex-column justify-center align-center py-4 py-md-6" style="border-bottom: 4px solid #f57f17 !important">
                <v-avatar color="amber-lighten-5" size="48" class="mb-2"><v-icon color="amber-darken-3" size="28">mdi-wallet</v-icon></v-avatar>
                <div class="  text-grey-darken-1 text-uppercase font-weight-bold">ຍອດຄ້າງຮັບ</div>
                <div class="      font-weight-black text-amber-darken-3 mt-1">{{ formatCurrency((reportData.total_principal_disbursed + reportData.total_interest_expected) - (reportData.total_collected + reportData.total_penalty)) }} ₭</div>
              </v-card>
            </v-col>
          </v-row>
          
          <div class="mt-6 text-center text-grey" v-if="loadingReport">ກຳລັງໂຫຼດຂໍ້ມູນ...</div>

          <!-- Report Details Table -->
          <div v-if="reportData && reportData.details && reportData.details.length > 0" class="mt-8 bg-white rounded-xl elevation-2 overflow-hidden">
            <div class="pa-4 bg-grey-lighten-4 border-b">
              <h3 class="font-weight-bold text-grey-darken-3 d-flex align-center"style="font-size:18px">
                <v-icon class="me-2 text-grey-darken-1">mdi-table</v-icon> ລາຍລະອຽດແຕ່ລະສັນຍາ (Loan Details)
              </h3>
            </div>
            <div class="overflow-x-auto">
              <v-table class="custom-table" hover style="min-width: 800px;">
              <thead>
                <tr class="bg-grey-lighten-4">
                  <th class="font-weight-bold">ລະຫັດ</th>
                  <th class="font-weight-bold">ຜູ້ກູ້</th>
                  <th class="font-weight-bold">ວັນທີເລີ່ມ</th>
                  <th class="font-weight-bold text-end">ຍອດປ່ອຍກູ້</th>
                  <th class="font-weight-bold text-end">ດອກເບ້ຍລວມ</th>
                  <th class="font-weight-bold text-end">ຍອດຕ້ອງຮັບ</th>
                  <th class="font-weight-bold text-end">ຍອດຮັບແລ້ວ</th>
                  <th class="font-weight-bold text-end">ຍອດຄ້າງຮັບ</th>
                  <th class="font-weight-bold text-center">ສະຖານະ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in reportData.details" :key="item.id">
                  <td>{{ String(item.id).padStart(5, '0') }}</td>
                  <td>{{ item.b_name }}</td>
                  <td>{{ formatDate(item.start_date) }}</td>
                  <td class="text-end">{{ formatCurrency(item.principal) }} ₭</td>
                  <td class="text-end">{{ formatCurrency(item.interest) }} ₭</td>
                  <td class="text-end text-purple-darken-3 font-weight-bold">{{ formatCurrency(parseFloat(item.principal) + parseFloat(item.interest)) }} ₭</td>
                  <td class="text-end text-green-darken-3 font-weight-bold">{{ formatCurrency(item.collected) }} ₭</td>
                  <td class="text-end text-amber-darken-3 font-weight-bold">{{ formatCurrency((parseFloat(item.principal) + parseFloat(item.interest)) - parseFloat(item.collected)) }} ₭</td>
                  <td class="text-center">
                    <v-chip :color="item.status === 'active' ? 'amber' : (item.status === 'completed' ? 'green' : 'red')" size="x-small" class="text-uppercase font-weight-bold">
                      {{ item.status === 'active' ? 'ກຳລັງຜ່ອນ' : (item.status === 'completed' ? 'ຈ່າຍຄົບແລ້ວ' : 'ໜີ້ເສຍ') }}
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </v-table>
            </div>
          </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';

const emit = defineEmits(['update:npl-count']);
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;
import html2canvas from 'html2canvas';

// In a real app, you might use jspdf, but we'll use window.print() or canvas trick for now
// To export PDF properly, we can just use window.print() or html2pdf.js if installed
// For image, html2canvas works perfectly.

const userName = ref('');
const showImagesInView = ref(false);
const loans = ref([]);
const borrowers = ref([]);
const loading = ref(false);
const saving = ref(false);
const savingCollateral = ref(false);

const showCreateDialog = ref(false);
const showDetailDialog = ref(false);
const showCollateralForm = ref(false);
const showPayDialog = ref(false);
const showReportDialog = ref(false);
const showDeleteCollateralDialog = ref(false);
const showDeleteLoanDialog = ref(false);
const collateralToDelete = ref(null);
const deletingCollateral = ref(false);
const deletingLoan = ref(false);

const selectedLoan = ref(null);
const payingSchedule = ref(null);
const penaltyFee = ref('');
const savingPayment = ref(false);

const loadingReport = ref(false);
const reportData = ref(null);

const newCollateral = ref({ type: 'ລົດໃຫຍ່', description: '', estimated_value: '', files: [] });

const newLoan = ref({
  borrower_id: null,
  principal: '',
  interest_rate: '',
  interest_type: 'flat',
  term_months: '',
  start_date: new Date().toISOString().substr(0, 10)
});

const headers = [
  { title: 'ເລກທີສັນຍາ', key: 'id' },
  { title: 'ຜູ້ກู้', key: 'b_name' },
  { title: 'ຍອດກู้', key: 'principal', align: 'end' },
  { title: 'ດອກເບ້ຍ', key: 'interest_rate' },
  { title: 'ງວດ', key: 'term_months', align: 'center' },
  { title: 'ສະຖານະ', key: 'status_display', align: 'center' },
  { title: 'ຈັດການ', key: 'actions', align: 'center', sortable: false },
];

const activeCount = computed(() => loans.value.filter(l => l.status === 'active' && !l.is_npl).length);
const nplCount = computed(() => loans.value.reduce((sum, l) => sum + (l.alert_schedules_count || (l.is_npl ? 1 : 0)), 0));
const completedCount = computed(() => loans.value.filter(l => l.status === 'completed').length);

watch(nplCount, (newVal) => {
  emit('update:npl-count', newVal);
}, { immediate: true });

const fetchLoans = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem('token');
    const res = await axios.post(`${apiBase}/pro-loan/list`, { token });
    loans.value = res.data.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const fetchBorrowers = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.post(`${apiBase}/borrower/show`, { token });
    borrowers.value = res.data.data || res.data;
  } catch (err) {
    console.error(err);
  }
};

const submitLoan = async () => {
  saving.value = true;
  try {
    await axios.post(`${apiBase}/pro-loan/create`, newLoan.value);
    showCreateDialog.value = false;
    newLoan.value = { borrower_id: null, principal: '', interest_rate: '', interest_type: 'flat', term_months: '', start_date: new Date().toISOString().substr(0, 10) };
    fetchLoans();
  } catch (err) {
    console.error(err);
    alert('ບໍ່ສາມາດສ້າງສັນຍາໄດ້');
  } finally {
    saving.value = false;
  }
};

const viewLoan = async (loan) => {
  try {
    const res = await axios.get(`${apiBase}/pro-loan/${loan.id}`);
    selectedLoan.value = res.data.data;
    showCollateralForm.value = false;
    showImagesInView.value = false;
    showDetailDialog.value = true;
  } catch (err) {
    console.error(err);
  }
};

const promptDeleteLoan = () => {
  showDeleteLoanDialog.value = true;
};

const confirmDeleteLoan = async () => {
  deletingLoan.value = true;
  try {
    await axios.delete(`${apiBase}/pro-loan/${selectedLoan.value.id}`);
    showDeleteLoanDialog.value = false;
    showDetailDialog.value = false;
    fetchLoans();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || 'ບໍ່ສາມາດລຶບສັນຍາໄດ້');
  } finally {
    deletingLoan.value = false;
  }
};

const promptDeleteCollateral = (id) => {
  collateralToDelete.value = id;
  showDeleteCollateralDialog.value = true;
};

const confirmDeleteCollateral = async () => {
  if (!collateralToDelete.value) return;
  deletingCollateral.value = true;
  try {
    await axios.delete(`${apiBase}/pro-loan/collateral/${collateralToDelete.value}`);
    viewLoan(selectedLoan.value);
    showDeleteCollateralDialog.value = false;
  } catch (err) {
    console.error(err);
    alert('ບໍ່ສາມາດລຶບຫຼັກຊັບໄດ້');
  } finally {
    deletingCollateral.value = false;
  }
};

const submitCollateral = async () => {
  let finalDescription = newCollateral.value.description;
  let finalEstimatedValue = newCollateral.value.estimated_value;

  if (newCollateral.value.type === 'ບຸກຄົນຄ້ຳປະກັນ') {
    if (!newCollateral.value.guarantor_name || !newCollateral.value.guarantor_id) {
      alert('ກະລຸນາປ້ອນຊື່ ແລະ ເລກບັດປະຈຳຕົວຜູ້ຄ້ຳປະກັນ');
      return;
    }
    finalDescription = `ຊື່: ${newCollateral.value.guarantor_name}, ວ/ດ/ປ ເກີດ: ${newCollateral.value.guarantor_dob || '-'}, ເລກບັດ: ${newCollateral.value.guarantor_id}, ທີ່ຢູ່: ${newCollateral.value.guarantor_address || '-'}`;
    finalEstimatedValue = 0;
  } else {
    if (!newCollateral.value.description) {
      alert('ກະລຸນາປ້ອນລາຍລະອຽດຫຼັກຊັບ');
      return;
    }
  }
  
  savingCollateral.value = true;
  try {
    let uploadedUrls = [];
    
    // Check if files are selected and upload them first
    if (newCollateral.value.files && newCollateral.value.files.length > 0) {
      const formData = new FormData();
      newCollateral.value.files.forEach(file => {
        formData.append('files', file);
      });
      
      const uploadRes = await axios.post(`${apiBase}/upload/multiple`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (uploadRes.data.status === '00' && uploadRes.data.urls) {
        uploadedUrls = uploadRes.data.urls;
      }
    }

    const payload = {
      type: newCollateral.value.type,
      description: finalDescription,
      estimated_value: finalEstimatedValue,
      image_url: uploadedUrls.length > 0 ? JSON.stringify(uploadedUrls) : null
    };

    await axios.post(`${apiBase}/pro-loan/${selectedLoan.value.id}/collateral`, payload);
    newCollateral.value = { type: 'ລົດໃຫຍ່', description: '', estimated_value: '', files: [], guarantor_name: '', guarantor_dob: '', guarantor_id: '', guarantor_address: '' };
    showCollateralForm.value = false;
    // Refresh loan details to show new collateral
    viewLoan(selectedLoan.value);
  } catch (err) {
    console.error(err);
    alert('ບໍ່ສາມາດບັນທຶກຫຼັກຊັບໄດ້');
  } finally {
    savingCollateral.value = false;
  }
};

const parseFiles = (urlsJson) => {
  if (!urlsJson) return [];
  try {
    const parsed = JSON.parse(urlsJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [urlsJson];
  }
};

const formatCollateralDescription = (desc, type) => {
  if (!desc) return '';
  if (type === 'ບຸກຄົນຄ້ຳປະກັນ') {
    let formatted = desc.replace(/\n/g, ', '); // Fallback for existing records with newlines
    formatted = formatted.replace(/ຊື່:/g, '<b>ຊື່:</b>');
    formatted = formatted.replace(/ວ\/ດ\/ປ ເກີດ:/g, '<b>ວ/ດ/ປ ເກີດ:</b>');
    formatted = formatted.replace(/ເລກບັດ:/g, '<b>ເລກບັດ:</b>');
    formatted = formatted.replace(/ທີ່ຢູ່:/g, '<b>ທີ່ຢູ່:</b>');
    return formatted;
  }
  return desc;
};

const isImage = (url) => {
  if (!url) return false;
  const ext = url.split('.').pop().toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
};

const hasImages = (loan) => {
  if (!loan || !loan.collaterals) return false;
  for (const col of loan.collaterals) {
    const files = parseFiles(col.image_url);
    if (files.some(f => isImage(f))) return true;
  }
  return false;
};

const hasGuarantor = (loan) => {
  return loan?.collaterals?.some(c => c.type === 'ບຸກຄົນຄ້ຳປະກັນ');
};

const getGuarantorName = (loan) => {
  const g = loan?.collaterals?.find(c => c.type === 'ບຸກຄົນຄ້ຳປະກັນ');
  if (!g || !g.description) return '';
  const match = g.description.match(/ຊື່:\s*([^,\n]+)/);
  return match ? match[1].trim() : 'ລາຍເຊັນ';
};

const openPayDialog = (schedule) => {
  payingSchedule.value = schedule;
  penaltyFee.value = '';
  showPayDialog.value = true;
};

const confirmPayment = async () => {
  savingPayment.value = true;
  try {
    const penaltyAmt = penaltyFee.value || 0;
    await axios.post(`${apiBase}/pro-loan/${payingSchedule.value.id}/pay`, {
      amount_paid: payingSchedule.value.total_due,
      penalty_paid: penaltyAmt
    });
    
    // Print Bill
    printPaymentBill(payingSchedule.value, selectedLoan.value, penaltyAmt);

    showPayDialog.value = false;
    viewLoan(selectedLoan.value);
    fetchLoans();
  } catch (err) {
    console.error(err);
    alert('ບໍ່ສາມາດບັນທຶກການຊຳລະໄດ້');
  } finally {
    savingPayment.value = false;
  }
};

const printPaymentBill = (schedule, loan, penalty) => {
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  
  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  
  const totalPaid = Number(schedule.total_due) + Number(penalty);
  const totalInstallments = loan.term_months || loan.schedules.length;
  const paidCount = loan.schedules.filter(s => s.status === 'paid' || s.id === schedule.id).length;
  const remainingCount = totalInstallments - paidCount;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>ໃບບິນຮັບເງິນ - ງວດທີ ${schedule.installment_no}</title>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          body { 
            font-family: 'Noto Sans Lao', sans-serif; 
            padding: 20px; 
            color: #333; 
            background: #f5f7fa; 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact;
          }
          .receipt-container {
            max-width: 750px;
            margin: 0 auto;
            background: #fff;
            padding: 40px 50px;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.08);
            border-top: 8px solid #283593;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #eee;
            padding-bottom: 25px;
            margin-bottom: 35px;
          }
          .header-title h2 { 
            margin: 0 0 8px 0; 
            font-size: 26px; 
            color: #1a237e; 
            letter-spacing: 0.5px;
          }
          .header-title p { 
            margin: 0; 
            color: #666; 
            font-size: 14px; 
            line-height: 1.5;
          }
          .header-logo {
            width: 70px;
            height: 70px;
            background: #283593;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            font-weight: bold;
          }
          .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px 40px;
            margin-bottom: 35px;
            font-size: 15px;
          }
          .detail-item {
            display: flex;
            align-items: center;
            border-bottom: 1px dashed #ddd;
            padding-bottom: 10px;
          }
          .detail-label { 
            color: #555; 
            width: 140px; 
            flex-shrink: 0;
          }
          .detail-value { 
            font-weight: 700; 
            color: #111; 
            font-size: 15px;
          }
          .amount-box { 
            background: #f8f9fa; 
            border: 1px solid #e9ecef; 
            padding: 30px; 
            border-radius: 10px; 
            margin-bottom: 40px; 
          }
          .amount-box h3 { 
            margin: 0 0 25px 0; 
            color: #1a237e; 
            font-size: 20px;
            border-bottom: 2px solid #1a237e;
            display: inline-block;
            padding-bottom: 5px;
          }
          .amount-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            font-size: 16px;
            color: #444;
          }
          .amount-total {
            display: flex;
            justify-content: space-between;
            margin-top: 25px;
            padding-top: 20px;
            border-top: 2px dashed #ccc;
            font-size: 22px;
            font-weight: bold;
            color: #b71c1c;
          }
          .signatures { display: flex; justify-content: space-between; margin-top: 70px; }
          .sig-box { text-align: center; width: 45%; }
          .sig-line { border-bottom: 1px dotted #000; margin: 60px auto 10px auto; width: 65%; }
          @media print {
            body { background: #fff; padding: 0; }
            .receipt-container { box-shadow: none; padding: 10px 0; border-top: none; max-width: 100%; }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <div class="header-title">
              <h2>ໃບບິນຮັບຊຳລະຄ່າງວດ</h2>
              <p>ເລກທີໃບບິນ: #RC-${Date.now().toString().slice(-6)}</p>
              <p>ວັນທີ: ${dateStr}</p>
            </div>
            <div class="header-logo">PL</div>
          </div>
          
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label">ຊື່ລູກຄ້າ:</span>
              <span class="detail-value">${loan.b_name}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">ເລກທີສັນຍາກູ້ຢືມ:</span>
              <span class="detail-value">${String(loan.id).padStart(5, '0')}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">ຈຳນວນເງິນທີ່ກູ້ຢືມ:</span>
              <span class="detail-value">${formatCurrency(loan.principal)} ₭</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">ຈ່າຍ:</span>
              <span class="detail-value">${formatCurrency(schedule.total_due)} ₭ / ງວດ</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">ຊຳລະສຳລັບງວດທີ:</span>
              <span class="detail-value">${schedule.installment_no}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">ຈຳນວນງວດທັງໝົດ:</span>
              <span class="detail-value">${totalInstallments} ງວດ</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">ຈ່າຍແລ້ວ:</span>
              <span class="detail-value">${paidCount} ງວດ</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">ຍັງເຫຼືອ:</span>
              <span class="detail-value">${remainingCount} ງວດ</span>
            </div>
          </div>

          <div class="amount-box">
            <h3>ລາຍລະອຽດການຊຳລະ</h3>
            <div class="amount-row">
              <span>ຍອດທີ່ຕ້ອງຊຳລະປົກກະຕິ:</span>
              <span>${formatCurrency(schedule.total_due)} ₭</span>
            </div>
            ${penalty > 0 ? `
            <div class="amount-row">
              <span>ຄ່າປັບໃໝລ່າຊ້າ:</span>
              <span>${formatCurrency(penalty)} ₭</span>
            </div>` : ''}
            <div class="amount-total">
              <span>ລວມຍອດຮັບຊຳລະທັງໝົດ:</span>
              <span>${formatCurrency(totalPaid)} ₭</span>
            </div>
          </div>

          <div class="signatures">
            <div class="sig-box">
              <div style="font-weight: bold;">ຜູ້ຮັບເງິນ / ພະນັກງານບັນຊີ</div>
              <div style="margin-top: 5px; color: #555;">(${userName.value})</div>
              <div class="sig-line"></div>
            </div>
            <div class="sig-box">
              <div style="font-weight: bold;">ຜູ້ຈ່າຍເງິນ / ລູກຄ້າ</div>
              <div style="margin-top: 5px; color: #555;">(${loan.b_name})</div>
              <div class="sig-line"></div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `);
  
  printWindow.document.close();
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }, 1000);
};

const openReportDialog = async () => {
  showReportDialog.value = true;
  loadingReport.value = true;
  try {
    const token = localStorage.getItem('token');
    const res = await axios.post(`${apiBase}/pro-loan/report`, { token });
    reportData.value = res.data.data;
  } catch (err) {
    console.error(err);
  } finally {
    loadingReport.value = false;
  }
};

const exportReportToPDF = () => {
  const printElement = document.getElementById('report-print-area');
  if (!printElement) return;

  const printContents = printElement.innerHTML;
  
  const printWindow = window.open('', '_blank', 'width=1000,height=800');
  
  const now = new Date();
  const monthsLao = ['ມັງກອນ', 'ກຸມພາ', 'ມີນາ', 'ເມສາ', 'ພຶດສະພາ', 'ມິຖຸນາ', 'ກໍລະກົດ', 'ສິງຫາ', 'ກັນຍາ', 'ຕຸລາ', 'ພະຈິກ', 'ທັນວາ'];
  const dateStr = `${now.getDate()} ${monthsLao[now.getMonth()]} ${now.getFullYear()} ເວລາ ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Pro Loans Report</title>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Noto Sans Lao', sans-serif;
            padding: 40px;
            color: #333;
            background: #fff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-header {
            text-align: center;
            margin-bottom: 40px;
          }
          .print-header h1 {
            color: #1a237e;
            margin: 0 0 10px 0;
            font-size: 28px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .print-header p {
            color: #666;
            margin: 0;
            font-size: 14px;
          }
          .company-logo {
            width: 60px;
            height: 60px;
            background: #1a237e;
            color: white;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 15px;
          }
          
          /* Layout fix for Vuetify classes */
          .v-row {
            display: flex;
            flex-wrap: wrap;
            margin: -15px;
          }
          .v-col-6, .v-col-sm-6, .v-col-md-3 {
            padding: 15px;
            width: 25%;
            box-sizing: border-box;
          }
          .v-card {
            background: #f8f9fc !important;
            border: 1px solid #edf2f7;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .v-avatar { display: none; } /* Hide icons to make it cleaner */
          .text-uppercase { text-transform: uppercase; }
          .font-weight-bold { font-weight: bold; }
          .font-weight-black { font-weight: 900; }
          .mt-1 { margin-top: 8px; }
          .mt-8 { margin-top: 40px; }
          .mb-2 { margin-bottom: 8px; }
          .mb-6 { margin-bottom: 24px; }
          
          /* Typography Colors */
          .text-grey-darken-1 { color: #757575 !important; }
          .text-grey-darken-3 { color: #424242 !important; }
          .text-blue-darken-3 { color: #1565c0 !important; }
          .text-orange-darken-3 { color: #ef6c00 !important; }
          .text-green-darken-3 { color: #2e7d32 !important; }
          
          /* Font Sizes */
          .text-caption { font-size: 12px; }
          .text-md-subtitle-2 { font-size: 14px; }
          .text-h5, .text-h4, .text-md-h4, .text-md-h3, .text-md-h6 {
            font-size: 22px;
            margin: 10px 0 0 0;
          }
          
          /* Table Styling */
          .border-b { border-bottom: 2px solid #1a237e; padding-bottom: 10px; margin-bottom: 20px; }
          .v-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
          }
          .v-table th {
            background-color: #f1f5f9;
            color: #1e293b;
            font-weight: 700;
            padding: 12px 16px;
            text-align: left;
            border-bottom: 2px solid #cbd5e1;
          }
          .v-table td {
            padding: 12px 16px;
            border-bottom: 1px solid #e2e8f0;
            color: #334155;
          }
          .text-end { text-align: right !important; }
          .text-center { text-align: center !important; }
          
          @media print {
            body { padding: 0; }
            .v-col-6, .v-col-sm-6, .v-col-md-3 { width: 25%; }
            .v-card {
              border: 1px solid #ccc;
              box-shadow: none;
              break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <div class="company-logo">PL</div>
          <h1>ລາຍງານສະຫຼຸບລະບົບສິນເຊື່ອ</h1>
          <p>ສ້າງເມື່ອ: ${dateStr}</p>
        </div>
        ${printContents}
      </body>
    </html>
  `);
  
  printWindow.document.close();
  
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }, 1000);
};

const exportToImage = async () => {
  const originalShowImages = showImagesInView.value;
  showImagesInView.value = true;
  await nextTick();
  
  const element = document.getElementById('loan-document');
  if (!element) return;
  
  try {
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const link = document.createElement('a');
    link.download = `contract-${selectedLoan.value.id}.jpg`;
    link.href = imgData;
    link.click();
  } catch (err) {
    console.error('Error exporting image:', err);
    alert('ບໍ່ສາມາດດາວໂຫຼດຮູບພາບໄດ້');
  } finally {
    showImagesInView.value = originalShowImages;
  }
};

const exportToPDF = async () => {
  const originalShowImages = showImagesInView.value;
  showImagesInView.value = true;
  await nextTick();
  
  const printContents = document.getElementById('loan-document').innerHTML;
  
  showImagesInView.value = originalShowImages;
  
  const printWindow = window.open('', '_blank');
  
  // Get all styles from the current document to keep Vuetify styling
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map(el => el.outerHTML)
    .join('\n');
    
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>ສັນຍາເງິນກູ້ - ${String(selectedLoan.value?.id).padStart(5, '0')}</title>
        ${styles}
        <style>
          @media print {
            html, body {
              overflow: visible !important;
              height: auto !important;
              background-color: white !important;
            }
            .bg-grey-lighten-3 {
              background-color: white !important;
            }
            /* Remove shadows and margins for print */
            .elevation-4 {
              box-shadow: none !important;
            }
            #loan-document {
              max-width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            /* Ensure images don't get cut off between pages */
            img {
              page-break-inside: avoid;
            }
            .v-card {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body class="bg-white" style="overflow: visible; height: auto;">
        <div id="loan-document" class="pa-4 pa-md-8">
          ${printContents}
        </div>
      </body>
    </html>
  `);
  
  printWindow.document.close();
  
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }, 1000);
};

const formatCurrency = (val) => {
  if (!val) return '0.00';
  return Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const monthsLaoShort = ['ມ.ກ.', 'ກ.ພ.', 'ມ.ນ.', 'ມ.ສ.', 'ພ.ພ.', 'ມ.ຖ.', 'ກ.ລ.', 'ສ.ຫ.', 'ກ.ຍ.', 'ຕ.ລ.', 'ພ.ຈ.', 'ທ.ວ.'];
  return `${d.getDate()} ${monthsLaoShort[d.getMonth()]} ${d.getFullYear()}`;
};

const formatDateNumeric = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

const isOverdue = (sch) => {
  return sch.status === 'pending' && new Date(sch.due_date) < new Date();
};

const getDueDateColorClass = (sch) => {
  if (sch.status === 'paid') return '';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDate = new Date(sch.due_date);
  dueDate.setHours(0, 0, 0, 0);
  
  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 0) {
    return 'text-red font-weight-bold';
  } else if (diffDays <= 3) {
    return 'text-amber-darken-3 font-weight-bold';
  }
  
  return '';
};

const getStatusColor = (status) => {
  if (status === 'active') return 'blue';
  if (status === 'completed') return 'green';
  if (status === 'overdue') return 'red';
  return 'grey';
};

const getStatusText = (status) => {
  if (status === 'active') return 'ກຳລັງຜ່ອນ';
  if (status === 'completed') return 'ປິດຍອດ';
  if (status === 'overdue') return 'ຄ້າງຊຳລະ';
  return status;
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    userName.value = localStorage.getItem('user_name') || 'Admin';
  }
  fetchLoans();
  fetchBorrowers();
});
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
}
.gradient-header {
  background: linear-gradient(135deg, #283593 0%, #3949ab 100%) !important;
  color: white !important;
}
.gradient-report {
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%) !important;
  color: white !important;
}
.stat-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0,0,0,0.08) !important;
}
.custom-table {
  border-radius: 12px;
  overflow: hidden;
}
.custom-table th {
  background-color: #f8f9fa !important;
  color: #495057 !important;
  font-weight: 700 !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 16px !important;
}
.custom-table td {
  padding: 16px !important;
  vertical-align: middle;
  border-bottom: 1px solid #f1f3f5;
}
.custom-table tbody tr {
  transition: background-color 0.2s ease;
}
.custom-table tbody tr:hover {
  background-color: #f8f9fa !important;
}
.tracking-widest {
  letter-spacing: 1px;
}
</style>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }
  #print-area, #print-area * {
    visibility: visible;
  }
  #print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 0 !important;
    margin: 0 !important;
    box-shadow: none !important;
  }
  [data-html2canvas-ignore] {
    display: none !important;
  }
}

#print-area {
  font-family: 'Noto Sans Lao', sans-serif !important;
}
#print-area .text-h4, 
#print-area .text-h6, 
#print-area h1, 
#print-area h3, 
#print-area .text-subtitle-1, 
#print-area .text-body-2,
#print-area .font-weight-bold {
  font-family: 'Noto Sans Lao', sans-serif !important;
}
</style>
