<template>
  <client-only>
    <v-app class="app-container">
      <!-- Top Navigation Bar -->
      <v-app-bar app color="indigo-darken-3" elevation="2" class="px-2 px-sm-4" style="position: sticky; top: 0; z-index: 1000;">
        <v-app-bar-title class="font-weight-bold text-white d-flex align-center" style="flex: 0 0 auto;">
          <div class="app-logo me-2">
            <v-icon color="white" size="20">mdi-wallet-membership</v-icon>
          </div>
          <span class="app-title-text d-none d-md-flex text-amber-lighten-1" style="font-family: 'Noto Sans Lao', sans-serif;">ລະບົບຈັດການເງິນກູ້</span>
          <span class="app-title-text d-flex d-md-none text-amber-lighten-1" style="font-family: 'Noto Sans Lao', sans-serif;">ລະບົບຈັດການເງິນກູ້</span>
        </v-app-bar-title>

        <!-- Desktop Navigation Tabs -->
        <v-tabs
          v-model="activeTab"
          bg-color="transparent"
          color="white"
          slider-color="white"
          class="d-none d-sm-flex ms-4 pl-8"
        >
          <v-tab value="dashboard" class="px-2 px-md-4 text-white text-none font-weight-medium">
            <v-icon size="20" class="me-2">mdi-view-dashboard</v-icon> ໜ້າຫຼັກ
          </v-tab>
          <v-tab value="borrowers" class="px-2 px-md-4 text-white text-none font-weight-medium">
            <v-icon size="20" class="me-2">mdi-account-multiple</v-icon> ຜູ້ກູ້ຢືມ
          </v-tab>
          <v-tab value="loans" class="px-2 px-md-4 text-white text-none font-weight-medium">
            <v-icon size="20" class="me-2">mdi-cash-register</v-icon> ບັນຊີ
          </v-tab>
          <v-tab value="reports" class="px-2 px-md-4 text-white text-none font-weight-medium">
            <v-icon size="20" class="me-2">mdi-chart-bar</v-icon> ລາຍງານ
          </v-tab>
          <v-tab value="profile" class="px-2 px-md-4 text-white text-none font-weight-medium">
            <v-icon size="20" class="me-2">mdi-account-cog</v-icon> ໂປຣໄຟລ໌
          </v-tab>
          <v-tab value="pro_loans" class="px-2 px-md-4 text-white text-none font-weight-medium">
            <v-badge :content="proLoansNplCount" :model-value="proLoansNplCount > 0" color="error" floating>
              <v-icon size="20" class="me-2 text-amber-lighten-2">mdi-star-circle</v-icon>
            </v-badge>
            Pro Loans
          </v-tab>
          <v-tab v-if="user && user.role === 'admin'" value="admin" class="px-2 px-md-4 text-white text-none font-weight-medium">
            <v-icon size="20" class="me-2">mdi-shield-crown</v-icon> Admin
          </v-tab>
        </v-tabs>

        <v-spacer></v-spacer>
        <div v-if="user" class="d-flex align-center me-2 me-sm-4 gap-1 gap-sm-2">
          <div class="user-pill d-flex align-center px-2 px-sm-3 py-1">
            <v-avatar size="26" color="indigo-lighten-4" class="me-0 me-sm-2">
              <v-icon size="15" color="indigo-darken-3">mdi-account</v-icon>
            </v-avatar>
            <span class="text-white font-weight-medium" style="font-size:13px;">{{ user.user_name || 'ຜູ້ໃຊ້' }}</span>
            <v-chip size="x-small" color="indigo-lighten-4" variant="flat" class="ms-1 ms-sm-2 text-indigo-darken-3 font-weight-bold d-none d-lg-flex">{{ user.role }}</v-chip>
          </div>
          <v-btn icon @click="handleLogout" size="small" color="rgba(255,255,255,0.15)" variant="flat" class="logout-btn ms-2 ms-sm-3" title="ອອກຈາກລະບົບ">
            <v-icon color="white" size="18">mdi-logout</v-icon>
          </v-btn>
        </div>
      </v-app-bar>

      <v-main class="main-bg">
        <v-container class="page-container">

          <!-- Navigation Tabs — responsive scrollable (Mobile Only) -->
          <div class="nav-tabs-wrapper mb-6 mt-n10 sticky-tabs d-sm-none">
            <v-tabs
              v-model="activeTab"
              bg-color="white"
              color="indigo-darken-3"
              slider-color="indigo-darken-3"
              show-arrows
              class="nav-tabs-bar"
            >
              <v-tab value="dashboard" class="nav-tab px-2 px-sm-4">
                <div class="d-flex flex-column flex-sm-row align-center">
                  <v-icon size="20" class="mb-1 mb-sm-0 me-0 me-sm-2">mdi-view-dashboard</v-icon>
                  <span class="text-caption text-sm-body-2">ໜ້າຫຼັກ</span>
                </div>
              </v-tab>
              <v-tab value="borrowers" class="nav-tab px-2 px-sm-4">
                <div class="d-flex flex-column flex-sm-row align-center">
                  <v-icon size="20" class="mb-1 mb-sm-0 me-0 me-sm-2">mdi-account-multiple</v-icon>
                  <span class="text-caption text-sm-body-2">ຜູ້ກູ້ຢືມ</span>
                </div>
              </v-tab>
              <v-tab value="loans" class="nav-tab px-2 px-sm-4">
                <div class="d-flex flex-column flex-sm-row align-center">
                  <v-icon size="20" class="mb-1 mb-sm-0 me-0 me-sm-2">mdi-cash-register</v-icon>
                  <span class="text-caption text-sm-body-2">ບັນຊີ</span>
                </div>
              </v-tab>
              <v-tab value="reports" class="nav-tab px-2 px-sm-4">
                <div class="d-flex flex-column flex-sm-row align-center">
                  <v-icon size="20" class="mb-1 mb-sm-0 me-0 me-sm-2">mdi-chart-bar</v-icon>
                  <span class="text-caption text-sm-body-2">ລາຍງານ</span>
                </div>
              </v-tab>
              <v-tab value="profile" class="nav-tab px-2 px-sm-4">
                <div class="d-flex flex-column flex-sm-row align-center">
                  <v-icon size="20" class="mb-1 mb-sm-0 me-0 me-sm-2">mdi-account-cog</v-icon>
                  <span class="text-caption text-sm-body-2">ໂປຣໄຟລ໌</span>
                </div>
              </v-tab>
              <v-tab value="pro_loans" class="nav-tab px-2 px-sm-4">
                <div class="d-flex flex-column flex-sm-row align-center">
                  <v-icon size="20" class="mb-1 mb-sm-0 me-0 me-sm-2 text-amber-darken-2">mdi-star-circle</v-icon>
                  <span class="text-caption text-sm-body-2 d-flex align-center">
                    Pro
                    <v-badge :content="proLoansNplCount" :model-value="proLoansNplCount > 0" color="error" inline class="ms-1"></v-badge>
                  </span>
                </div>
              </v-tab>
              <v-tab v-if="user && user.role === 'admin'" value="admin" class="nav-tab px-2 px-sm-4">
                <div class="d-flex flex-column flex-sm-row align-center">
                  <v-icon size="20" class="mb-1 mb-sm-0 me-0 me-sm-2">mdi-shield-crown</v-icon>
                  <span class="text-caption text-sm-body-2">Admin</span>
                </div>
              </v-tab>
            </v-tabs>
          </div>

          <!-- Tab Contents -->
          <v-window v-model="activeTab">
            
            <!-- PRO LOANS TAB -->
            <v-window-item value="pro_loans" eager>
              <ProLoanSystem @update:npl-count="proLoansNplCount = $event" />
            </v-window-item>
            
            <!-- 1. DASHBOARD & ACTIVITIES TAB -->
            <v-window-item value="dashboard">
              <!-- Welcome Banner -->
              <v-row class="mb-2 mb-sm-6">
                <v-col cols="12">
                  <v-card class="welcome-banner text-white rounded-xl elevation-3 overflow-hidden py-4 px-5 py-sm-6 px-sm-8 d-flex align-center justify-space-between position-relative">
                    <div class="z-index-1">
                      <h1 class="text-h6 text-sm-h4 font-weight-bold mb-1 mb-sm-2 text-white">ສະບາຍດີ, {{ user ? user.user_name : 'ຜູ້ໃຊ້' }}! 👋</h1>
                      <p class="text-caption text-sm-body-1 opacity-90 font-weight-medium max-w-text mb-0">ຍິນດີຕ້ອນຮັບເຂົ້າສູ່ລະບົບຈັດການເງິນກູ້ ແລະ ບັນຊີ. ຈັດການຂໍ້ມູນ ແລະ ຕິດຕາມລາຍການທັງໝົດໄດ້ໃນບ່ອນດຽວຢ່າງສະດວກສະບາຍ.</p>
                    </div>
                    <div class="decor-circle-1 z-index-0"></div>
                    <div class="decor-circle-2 z-index-0"></div>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Summary Statistics Cards -->
              <v-row class="mb-2 mb-sm-8" dense>
                <v-col cols="4" sm="4">
                  <v-card class="stat-card summary-top-card border-s-lg border-indigo rounded-xl elevation-2 bg-white h-100" hover>
                    <div class="d-flex flex-column flex-sm-row justify-center justify-sm-space-between align-center pa-2 pa-sm-5 text-center text-sm-start h-100">
                      <div class="stat-icon-wrapper bg-indigo-lighten-5 mb-1 mb-sm-0 order-1 order-sm-2 mx-auto mx-sm-0" style="padding: 6px;">
                        <v-icon color="indigo" size="20" class="d-sm-none">mdi-account-multiple-outline</v-icon>
                        <v-icon color="indigo" size="28" class="d-none d-sm-block">mdi-account-multiple-outline</v-icon>
                      </div>
                      <div class="pl-0 pl-sm-2 order-2 order-sm-1 w-100 text-truncate">
                        <div class="text-grey-darken-1 mb-0 font-weight-medium d-sm-none text-truncate" style="font-size: 10px; line-height: 1.2;">ຜູ້ກູ້ຢືມ</div>
                        <div class="text-sm-subtitle-2 text-grey-darken-1 mb-0 mb-sm-1 font-weight-medium d-none d-sm-block">ຜູ້ກູ້ຢືມທັງໝົດ</div>
                        <div class="text-subtitle-1 text-sm-h4 font-weight-bold text-indigo-darken-3" style="line-height: 1.2;">{{ borrowers.length }} <span class="text-caption text-sm-subtitle-1 text-grey-darken-1 font-weight-medium d-none d-sm-inline">ຄົນ</span></div>
                        <div class="text-caption text-grey mt-1 mt-sm-2 d-none d-sm-block">ຈຳນວນລູກຄ້າທັງໝົດໃນລະບົບ</div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
                <v-col cols="4" sm="4">
                  <v-card class="stat-card summary-top-card border-s-lg border-teal rounded-xl elevation-2 bg-white h-100" hover>
                    <div class="d-flex flex-column flex-sm-row justify-center justify-sm-space-between align-center pa-2 pa-sm-5 text-center text-sm-start h-100">
                      <div class="stat-icon-wrapper bg-teal-lighten-5 mb-1 mb-sm-0 order-1 order-sm-2 mx-auto mx-sm-0" style="padding: 6px;">
                        <v-icon color="teal" size="20" class="d-sm-none">mdi-lightning-bolt-outline</v-icon>
                        <v-icon color="teal" size="28" class="d-none d-sm-block">mdi-lightning-bolt-outline</v-icon>
                      </div>
                      <div class="pl-0 pl-sm-2 order-2 order-sm-1 w-100 text-truncate">
                        <div class="text-grey-darken-1 mb-0 font-weight-medium d-sm-none text-truncate" style="font-size: 10px; line-height: 1.2;">ກິດຈະກຳ</div>
                        <div class="text-sm-subtitle-2 text-grey-darken-1 mb-0 mb-sm-1 font-weight-medium d-none d-sm-block">ປະເພດກິດຈະກຳ</div>
                        <div class="text-subtitle-1 text-sm-h4 font-weight-bold text-teal-darken-2" style="line-height: 1.2;">{{ activities.length }} <span class="text-caption text-sm-subtitle-1 text-grey-darken-1 font-weight-medium d-none d-sm-inline">ປະເພດ</span></div>
                        <div class="text-caption text-grey mt-1 mt-sm-2 d-none d-sm-block">ປະເພດລາຍການເຄື່ອນໄຫວ</div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
                <v-col cols="4" sm="4">
                  <v-card class="stat-card summary-top-card border-s-lg border-deep-orange rounded-xl elevation-2 bg-white h-100" hover>
                    <div class="d-flex flex-column flex-sm-row justify-center justify-sm-space-between align-center pa-2 pa-sm-5 text-center text-sm-start h-100">
                      <div class="stat-icon-wrapper bg-deep-orange-lighten-5 mb-1 mb-sm-0 order-1 order-sm-2 mx-auto mx-sm-0" style="padding: 6px;">
                        <v-icon color="deep-orange" size="20" class="d-sm-none">mdi-alert-circle-outline</v-icon>
                        <v-icon color="deep-orange" size="28" class="d-none d-sm-block">mdi-alert-circle-outline</v-icon>
                      </div>
                      <div class="pl-0 pl-sm-2 order-2 order-sm-1 w-100 text-truncate">
                        <div class="text-grey-darken-1 mb-0 font-weight-medium d-sm-none text-truncate" style="font-size: 10px; line-height: 1.2;">ຄ້າງຊຳລະ</div>
                        <div class="text-sm-subtitle-2 text-grey-darken-1 mb-0 mb-sm-1 font-weight-medium d-none d-sm-block">ລາຍການຄ້າງຊຳລະ</div>
                        <div class="text-subtitle-1 text-sm-h4 font-weight-bold text-deep-orange-darken-2" style="line-height: 1.2;">{{ indebtedLoansCount }} <span class="text-caption text-sm-subtitle-1 text-grey-darken-1 font-weight-medium d-none d-sm-inline">ບິນ</span></div>
                        <div class="text-caption text-grey mt-1 mt-sm-2 d-none d-sm-block">ຈຳນວນບິນທີ່ຄ້າງ</div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Weight & Finance Summaries -->
              <h3 class="responsive-heading font-weight-bold text-indigo-darken-3 mb-3 d-flex align-center mt-2">
                <v-icon color="indigo" class="me-2">mdi-scale-balance</v-icon>
                ສະຫຼຸບນ້ຳໜັກ ແລະ ຍອດເງິນ
              </h3>
              <v-row class="mb-8" dense>
                <!-- KG Received -->
                <v-col cols="6" sm="6" md="3">
                  <v-card class="stat-card summary-card border-s-lg border-green rounded-xl elevation-2 bg-white" hover link @click="goToLoanDetails('ok')">
                    <div class="d-flex flex-column pa-3 pa-sm-5">
                      <div class="d-flex justify-space-between align-center mb-1 mb-sm-2">
                        <div class="stat-icon-wrapper bg-green-lighten-5">
                          <v-icon color="green" size="24" class="responsive-icon">mdi-weight-kilogram</v-icon>
                        </div>
                        <v-chip size="x-small" color="green" variant="flat" class="responsive-chip">ສຳເລັດ</v-chip>
                      </div>
                      <div class="text-subtitle-2 text-grey-darken-1 mb-0 mb-sm-1 font-weight-medium responsive-label">ນ້ຳໜັກທີ່ໄດ້ຮັບແລ້ວ</div>
                      <div class="text-h5 font-weight-bold text-green-darken-2 responsive-value text-truncate">{{ homeKgReceived.toFixed(2) }} <span class="text-caption text-sm-subtitle-2 text-grey-darken-1">kg</span></div>
                    </div>
                  </v-card>
                </v-col>

                <!-- KG Indebted -->
                <v-col cols="6" sm="6" md="3">
                  <v-card class="stat-card summary-card border-s-lg border-orange rounded-xl elevation-2 bg-white" hover link @click="goToLoanDetails('indebted')">
                    <div class="d-flex flex-column pa-3 pa-sm-5">
                      <div class="d-flex justify-space-between align-center mb-1 mb-sm-2">
                        <div class="stat-icon-wrapper bg-orange-lighten-5">
                          <v-icon color="orange" size="24" class="responsive-icon">mdi-weight</v-icon>
                        </div>
                        <v-chip size="x-small" color="orange" variant="flat" class="responsive-chip">ຍັງຄ້າງ</v-chip>
                      </div>
                      <div class="text-subtitle-2 text-grey-darken-1 mb-0 mb-sm-1 font-weight-medium responsive-label">ນ້ຳໜັກທີ່ຍັງຄ້າງຮັບ</div>
                      <div class="text-h5 font-weight-bold text-orange-darken-2 responsive-value text-truncate">{{ homeKgIndebted.toFixed(2) }} <span class="text-caption text-sm-subtitle-2 text-grey-darken-1">kg</span></div>
                    </div>
                  </v-card>
                </v-col>

                <!-- Amount Received -->
                <v-col cols="6" sm="6" md="3">
                  <v-card class="stat-card summary-card border-s-lg border-blue rounded-xl elevation-2 bg-white" hover link @click="goToLoanDetails('ok')">
                    <div class="d-flex flex-column pa-3 pa-sm-5">
                      <div class="d-flex justify-space-between align-center mb-1 mb-sm-2">
                        <div class="stat-icon-wrapper bg-blue-lighten-5">
                          <v-icon color="blue" size="24" class="responsive-icon">mdi-cash-check</v-icon>
                        </div>
                        <v-chip size="x-small" color="blue" variant="flat" class="responsive-chip">ສຳເລັດ</v-chip>
                      </div>
                      <div class="text-subtitle-2 text-grey-darken-1 mb-0 mb-sm-1 font-weight-medium responsive-label">ຍອດເງິນທີ່ເຄຍແລ້ວ</div>
                      <div class="text-h5 font-weight-bold text-blue-darken-2 responsive-value text-truncate">{{ formatNumber(homeAmountReceived) }} <span class="text-caption text-sm-subtitle-2 text-grey-darken-1">LAK</span></div>
                    </div>
                  </v-card>
                </v-col>

                <!-- Amount Indebted -->
                <v-col cols="6" sm="6" md="3">
                  <v-card class="stat-card summary-card border-s-lg border-red rounded-xl elevation-2 bg-white" hover link @click="goToLoanDetails('indebted')">
                    <div class="d-flex flex-column pa-3 pa-sm-5">
                      <div class="d-flex justify-space-between align-center mb-1 mb-sm-2">
                        <div class="stat-icon-wrapper bg-red-lighten-5">
                          <v-icon color="red" size="24" class="responsive-icon">mdi-cash-remove</v-icon>
                        </div>
                        <v-chip size="x-small" color="red" variant="flat" class="responsive-chip">ຍັງຄ້າງ</v-chip>
                      </div>
                      <div class="text-subtitle-2 text-grey-darken-1 mb-0 mb-sm-1 font-weight-medium responsive-label">ຍອດເງິນທີ່ຍັງຄ້າງຮັບ</div>
                      <div class="text-h5 font-weight-bold text-red-darken-2 responsive-value text-truncate">{{ formatNumber(homeAmountIndebted) }} <span class="text-caption text-sm-subtitle-2 text-grey-darken-1">LAK</span></div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Profit Calculator Button -->
              <div class="d-flex justify-center mb-6">
                <v-btn color="success" prepend-icon="mdi-calculator" rounded="lg" @click="profitDialog = true; calculatedProfit = null; currentPrice12Kg = null" elevation="2" class="font-weight-bold text-none px-6">
                  ຄຳນວນກຳໄລ ແລະ ຂາດທຶນ
                </v-btn>
              </div>

              <!-- Activities Slide & Table -->
              <v-row class="mb-2">
                <v-col cols="12" class="d-flex justify-space-between align-center flex-wrap gap-2">
                  <h2 class="responsive-heading font-weight-bold d-flex align-center text-indigo-darken-3 mb-0" style="line-height: 1;">
                    <v-icon color="indigo" class="me-2">mdi-select-group</v-icon>
                    ປະເພດກິດຈະກຳ
                  </h2>
                  <v-spacer></v-spacer>
                  <v-btn color="indigo-darken-3" prepend-icon="mdi-plus" @click="openActivityDialog(null)" size="small" class="mt-1 mt-sm-0">
                    ເພີ່ມກິດຈະກຳ
                  </v-btn>
                </v-col>
              </v-row>

              <v-row v-if="loading" justify="center" class="my-5">
                <v-progress-circular indeterminate color="indigo" size="50"></v-progress-circular>
              </v-row>

              <v-row v-else>
                <v-col cols="12">
                  <v-slide-group show-arrows class="pa-2">
                    <v-slide-item v-for="(item, index) in activities" :key="item.a_id" class="me-3">
                      <v-card :class="['modern-dash-card', `color-bg-${index % 4}`, 'activity-slide-card']" elevation="3">
                        <div class="card-inner p-3 d-flex flex-column justify-space-between h-100">
                          <div class="d-flex justify-space-between align-start mb-2 mb-sm-4">
                            <div class="glass-holder">
                              <v-icon color="white" size="20" class="d-none d-sm-block">mdi-lightning-bolt-outline</v-icon>
                              <v-icon color="white" size="16" class="d-sm-none">mdi-lightning-bolt-outline</v-icon>
                            </div>
                            <div class="d-flex">
                              <v-btn icon="mdi-pencil" variant="text" color="white" size="x-small" @click.stop="openActivityDialog(item)"></v-btn>
                              <v-btn icon="mdi-delete" variant="text" color="white" size="x-small" @click.stop="deleteActivity(item.a_id)"></v-btn>
                            </div>
                          </div>

                          <div class="text-white">
                            <div class="mb-1 text-truncate" style="font-size: 18px; font-weight: bold;"># {{ item.activity_name }}</div>
                          </div>

                          <div class="d-flex justify-space-between align-end mt-4">
                            <div class="text-caption text-white opacity-70 d-flex align-center">
                              <v-icon size="12" class="me-1">mdi-clock-outline</v-icon>
                              {{ formatDate(item.date_create) }}
                            </div>
                            <svg width="35" height="10" viewBox="0 0 45 15" class="decor-svg">
                              <path d="M0 12 Q 11 2, 22 12 T 45 7" stroke="rgba(255,255,255,0.4)" fill="none" stroke-width="2" />
                            </svg>
                          </div>
                        </div>
                      </v-card>
                    </v-slide-item>

                    <v-slide-item v-if="activities.length === 0" class="text-center w-100 my-4">
                      <div class="py-5 text-grey">
                        <v-icon size="50" color="grey-lighten-1">mdi-database-off-outline</v-icon>
                        <p class="mt-2">ບໍ່ມີຂໍ້ມູນກິດຈະກຳໃນຕອນນີ້</p>
                      </div>
                    </v-slide-item>
                  </v-slide-group>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- 2. BORROWERS TAB -->
            <v-window-item value="borrowers">
              <!-- Section Header -->
              <div class="section-header mb-4">
                <div class="section-header-left">
                  <div class="section-icon bg-indigo"><v-icon color="white" size="18">mdi-account-multiple</v-icon></div>
                  <div>
                    <div class="section-title">ລາຍຊື່ຜູ້ກູ້ຢືມ</div>
                    <div class="section-sub">{{ borrowers.length }} ລາຍການ</div>
                  </div>
                </div>
                <v-btn color="indigo" prepend-icon="mdi-plus" @click="openBorrowerDialog(null)" size="small" class="font-weight-bold" rounded="lg">
                  <span class="d-none d-sm-inline">ເພີ່ມຜູ້ກູ້</span>
                  <span class="d-inline d-sm-none">ເພີ່ມ</span>
                </v-btn>
              </div>

              <!-- MOBILE: Card list (xs only) -->
              <div class="d-flex d-md-none flex-column gap-3">
                <div v-if="borrowers.length === 0" class="empty-state">
                  <div class="empty-state-icon">👤</div>
                  <div class="empty-state-title">ບໍ່ມີຜູ້ກູ້ຢືມ</div>
                  <div class="empty-state-sub">ກົດເພີ່ມຜູ້ກູ້ຢືມຄົນແລກ</div>
                </div>
                <div v-for="b in borrowers" :key="b.b_id" class="borrower-card">
                  <div class="bc-left">
                    <div class="bc-avatar" style="overflow: hidden; padding: 0;">
                      <img v-if="b.b_image" :src="b.b_image" style="width: 100%; height: 100%; object-fit: cover;" />
                      <span v-else>{{ b.b_name.charAt(0) }}</span>
                    </div>
                    <div class="bc-info">
                      <div class="bc-name">{{ b.b_name }}</div>
                      <div class="bc-phone">
                        <v-icon size="12" class="me-1">mdi-phone</v-icon>{{ b.b_number }}
                      </div>
                      <div class="bc-address">
                        <v-icon size="12" class="me-1">mdi-map-marker</v-icon>{{ b.b_address }}
                      </div>
                    </div>
                  </div>
                  <v-btn icon size="small" variant="tonal" color="indigo" @click="openBorrowerDialog(b)">
                    <v-icon size="16">mdi-pencil</v-icon>
                  </v-btn>
                </div>
              </div>

              <!-- DESKTOP: Table (md+) -->
              <div class="d-none d-md-block">
                <div class="data-table-card">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th style="width:60px">#</th>
                        <th>ຊື່ - ນາມສະກຸນ</th>
                        <th>ເບີໂທລະສັບ</th>
                        <th>ທີ່ຢູ່</th>
                        <th class="text-center" style="width:80px">ຈັດການ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="borrowers.length === 0">
                        <td colspan="5" class="text-center py-8 text-grey">ບໍ່ມີລາຍຊື່ຜູ້ກູ້ຢືມໃນລະບົບ</td>
                      </tr>
                      <tr v-for="b in borrowers" :key="b.b_id">
                        <td class="text-grey font-weight-medium">{{ b.b_id }}</td>
                        <td>
                          <div class="d-flex align-center gap-2">
                            <div class="mini-avatar" style="overflow: hidden; padding: 0;">
                              <img v-if="b.b_image" :src="b.b_image" style="width: 100%; height: 100%; object-fit: cover;" />
                              <span v-else>{{ b.b_name.charAt(0) }}</span>
                            </div>
                            <span class="font-weight-bold">{{ b.b_name }}</span>
                          </div>
                        </td>
                        <td>{{ b.b_number }}</td>
                        <td class="text-grey-darken-1">{{ b.b_address }}</td>
                        <td class="text-center">
                          <v-btn icon="mdi-pencil" color="indigo" variant="text" size="small" @click="openBorrowerDialog(b)"></v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </v-window-item>

            <!-- 3. LOANS & ACCOUNTING TAB -->
            <v-window-item value="loans">
              <v-row>
                <!-- Main Loans List -->
                <v-col cols="12" md="8">
                  <!-- Section Header -->
                  <div class="section-header mb-4">
                    <div class="section-header-left">
                      <div class="section-icon bg-deep-purple"><v-icon color="white" size="18">mdi-cash-register</v-icon></div>
                      <div>
                        <div class="section-title">ລາຍການກູ້ຢືມ & ບັນຊີ</div>
                        <div class="section-sub">{{ loans.length }} ລາຍການ</div>
                      </div>
                    </div>
                    <v-btn color="deep-purple" prepend-icon="mdi-plus" @click="openLoanDialog(null)" size="small" class="font-weight-bold" rounded="lg">
                      <span class="d-none d-sm-inline">ບັນທຶກເງິນກູ້</span>
                      <span class="d-inline d-sm-none">ບັນທຶກ</span>
                    </v-btn>
                  </div>

                  <!-- Filter Tabs -->
                  <div class="filter-pill-group mb-4">
                    <button
                      v-for="f in [{v:'all',l:'ທັງໝົດ'},{v:'indebted',l:'ຄ້າງຊຳລະ'},{v:'ok',l:'ຈ່າຍແລ້ວ'}]"
                      :key="f.v"
                      :class="['filter-pill', loanFilterStatus === f.v ? 'filter-pill-active' : '']"
                      @click="loanFilterStatus = f.v; fetchLoans()"
                    >
                      {{ f.l }}
                    </button>
                  </div>

                  <!-- MOBILE: Loan Cards -->
                  <div class="d-flex d-md-none flex-column gap-3">
                    <div v-if="loans.length === 0" class="empty-state">
                      <div class="empty-state-icon">💳</div>
                      <div class="empty-state-title">ບໍ່ມີລາຍການ</div>
                      <div class="empty-state-sub">ກົດເພີ່ມເງິນກູ້ຄົນແລກ</div>
                    </div>
                    <div v-for="loan in loans" :key="loan.key_id" class="loan-card">
                      <div class="lc-top">
                        <div class="lc-borrower">
                          <div class="lc-avatar">{{ loan.borrower.charAt(0) }}</div>
                          <div>
                            <div class="lc-name">{{ loan.borrower }}</div>
                            <div class="lc-date">
                              <v-icon size="11" class="me-1">mdi-calendar</v-icon>{{ formatDateOnly(loan.borrow_date) }}
                            </div>
                          </div>
                        </div>
                        <div class="lc-actions">
                          <span :class="loan.status === 'ok' ? 'status-badge-ok' : 'status-badge-pending'" @click="toggleLoanStatus(loan)" style="cursor:pointer">
                            {{ loan.status === 'ok' ? 'ຈ່າຍແລ້ວ' : 'ຄ້າງ' }}
                          </span>
                          <v-btn icon size="x-small" variant="text" color="indigo" @click="openLoanDialog(loan)">
                            <v-icon size="15">mdi-pencil</v-icon>
                          </v-btn>
                        </div>
                      </div>
                      <div class="lc-body">
                        <v-chip size="x-small" color="blue-grey" variant="tonal" class="mb-2">{{ loan.activity_name }}</v-chip>
                        <div class="lc-stats">
                          <div class="lc-stat">
                            <div class="lc-stat-label">ຈຳນວນເງິນ</div>
                            <div class="lc-stat-value text-indigo">{{ formatNumber(loan.amount) }} <span class="lc-unit">{{ loan.currency }}</span></div>
                          </div>
                          <div class="lc-stat-divider"></div>
                          <div class="lc-stat">
                            <div class="lc-stat-label">ລາຄາ/12kg</div>
                            <div class="lc-stat-value">{{ formatNumber(loan.amount_per_kg) }}</div>
                          </div>
                          <div class="lc-stat-divider"></div>
                          <div class="lc-stat">
                            <div class="lc-stat-label">ນ້ຳໜັກ</div>
                            <div class="lc-stat-value text-purple">{{ loan.kg.toFixed(2) }} <span class="lc-unit">kg</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- DESKTOP: Table -->
                  <div class="d-none d-md-block">
                    <div class="data-table-card">
                      <table class="data-table">
                        <thead>
                          <tr>
                            <th>ວັນທີ</th>
                            <th>ຜູ້ກູ້</th>
                            <th>ກິດຈະກຳ</th>
                            <th class="text-right">ຈຳນວນເງິນ</th>
                            <th class="text-right">ລາຄາ/12kg</th>
                            <th class="text-right">ນ້ຳໜັກ (kg)</th>
                            <th class="text-center">ຈັດການສະຖານະ</th>
                            <th class="text-center" style="width:70px">ຈັດການ</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-if="loans.length === 0">
                            <td colspan="8" class="text-center py-8 text-grey">ບໍ່ມີລາຍການບັນທຶກເງິນກູ້</td>
                          </tr>
                          <tr v-for="loan in loans" :key="loan.key_id">
                            <td class="text-grey">{{ formatDateOnly(loan.borrow_date) }}</td>
                            <td>
                              <div class="d-flex align-center gap-2">
                                <div class="mini-avatar purple">{{ loan.borrower.charAt(0) }}</div>
                                <span class="font-weight-bold">{{ loan.borrower }}</span>
                              </div>
                            </td>
                            <td><v-chip size="x-small" color="blue-grey" variant="flat">{{ loan.activity_name }}</v-chip></td>
                            <td class="text-right font-weight-bold text-indigo">{{ formatNumber(loan.amount) }} {{ loan.currency }}</td>
                            <td class="text-right">{{ formatNumber(loan.amount_per_kg) }}</td>
                            <td class="text-right font-weight-bold text-purple">{{ loan.kg.toFixed(2) }} kg</td>
                            <td class="text-center">
                              <span :class="loan.status === 'ok' ? 'status-badge-ok' : 'status-badge-pending'" @click="toggleLoanStatus(loan)" style="cursor:pointer" title="ກົດເພື່ອປ່ຽນສະຖານະ">
                                {{ loan.status === 'ok' ? 'ຈ່າຍແລ້ວ' : 'ຄ້າງ' }}
                              </span>
                            </td>
                            <td class="text-center">
                              <v-btn icon="mdi-pencil" color="indigo" variant="text" size="small" @click="openLoanDialog(loan)"></v-btn>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </v-col>

                <!-- Calculator sidebar -->
                <v-col cols="12" md="4">
                  <div class="calc-card">
                    <div class="calc-header">
                      <div class="section-icon bg-teal me-3"><v-icon color="white" size="18">mdi-calculator</v-icon></div>
                      <div>
                        <div class="section-title">ເຄື່ອງຄິດເລກ</div>
                        <div class="section-sub">ນ້ຳໜັກ & ລາຄາ</div>
                      </div>
                    </div>
                    <div class="calc-body">
                      <div class="calc-label">ລາຄາຕໍ່ 12 ກິໂລກຣາມ</div>
                      <v-text-field v-model.number="calcPricePer12" type="number" variant="outlined" density="compact" class="mb-3" hide-details />
                      <div class="calc-label">ນ້ຳໜັກ (kg)</div>
                      <v-text-field v-model.number="calcKg" type="number" variant="outlined" density="compact" class="mb-4" hide-details />
                      <v-btn color="teal" block @click="runQuickCalculator" :loading="calculating" class="font-weight-bold" rounded="lg">
                        ຄຳນວນລາຄາ
                      </v-btn>
                      <div v-if="calcResult !== null" class="calc-result">
                        <div class="calc-result-label">ລາຄາລວມທັງໝົດ</div>
                        <div class="calc-result-value">{{ formatNumber(calcResult) }}</div>
                        <div class="calc-result-sub">ລາຄາຕໍ່ kg = {{ (calcPricePer12 / 12).toFixed(2) }}</div>
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- 4. REPORTS TAB — CHARTS -->
            <v-window-item value="reports">
              <!-- Page Header -->
              <div class="report-page-header mb-6">
                <div class="rph-left">
                  <div class="rph-badge">📊 Analytics</div>
                  <h2 class="rph-title">ລາຍງານ & ການວິເຄາະ</h2>
                  <p class="rph-sub">ສະຫຼຸບຂໍ້ມູນເງິນກູ້ທັງໝົດດ້ວຍກຣາຟສວຍງາມ</p>
                </div>
                <v-btn
                  color="indigo"
                  variant="tonal"
                  :icon="$vuetify.display.smAndDown"
                  :prepend-icon="$vuetify.display.smAndDown ? undefined : 'mdi-refresh'"
                  @click="fetchReports"
                  :loading="loadingReports"
                  rounded="lg"
                  size="small"
                >
                  <v-icon v-if="$vuetify.display.smAndDown">mdi-refresh</v-icon>
                  <span v-else>ໂຫຼດໃໝ່</span>
                </v-btn>
              </div>

              <!-- No data state -->
              <div v-if="reports.length === 0" class="empty-state">
                <div class="empty-state-icon">📭</div>
                <div class="empty-state-title">ບໍ່ມີຂໍ້ມູນລາຍງານ</div>
                <div class="empty-state-sub">ກະລຸນາເພີ່ມຂໍ້ມູນກ່ອນ ຫຼື ກົດໂຫຼດໃໝ່</div>
              </div>

              <div v-else>
                <!-- KPI Strip -->
                <v-row class="mb-5" dense>
                  <v-col cols="4" sm="4">
                    <div class="kpi-strip kpi-indigo">
                      <div class="kpi-strip-icon"><v-icon color="white" size="20">mdi-account-group</v-icon></div>
                      <div class="kpi-strip-body">
                        <div class="kpi-strip-val">{{ reports.length }}</div>
                        <div class="kpi-strip-lbl">ຜູ້ກູ້ທັງໝົດ</div>
                      </div>
                      <div class="kpi-strip-decor">👥</div>
                    </div>
                  </v-col>
                  <v-col cols="4" sm="4">
                    <div class="kpi-strip kpi-emerald">
                      <div class="kpi-strip-icon"><v-icon color="white" size="20">mdi-weight-kilogram</v-icon></div>
                      <div class="kpi-strip-body">
                        <div class="kpi-strip-val">{{ reportTotalKg.toFixed(1) }}</div>
                        <div class="kpi-strip-lbl">ນ້ຳໜັກລວມ (kg)</div>
                      </div>
                      <div class="kpi-strip-decor">⚖️</div>
                    </div>
                  </v-col>
                  <v-col cols="4" sm="4">
                    <div class="kpi-strip kpi-amber">
                      <div class="kpi-strip-icon"><v-icon color="white" size="20">mdi-alert-circle-outline</v-icon></div>
                      <div class="kpi-strip-body">
                        <div class="kpi-strip-val">{{ reportIndebtedCount }}</div>
                        <div class="kpi-strip-lbl">ຄ້າງຊຳລະ (ລາຍການ)</div>
                      </div>
                      <div class="kpi-strip-decor">⚠️</div>
                    </div>
                  </v-col>
                </v-row>

                <!-- Charts Row 1: Bar + Doughnut -->
                <v-row class="mb-4 charts-mobile-scroll" dense>
                  <v-col cols="10" sm="8" md="6" lg="8" class="chart-slide-item">
                    <div class="chart-glass-card">
                      <div class="cgc-header">
                        <div class="cgc-icon-wrap cgc-purple"><v-icon color="white" size="16">mdi-chart-bar</v-icon></div>
                        <div>
                          <div class="cgc-title">ນ້ຳໜັກ (kg) ແຍກຕາມຜູ້ກູ້ຢືມ</div>
                          <div class="cgc-sub"><span class="dot-green"></span>ຊຳລະ &nbsp;<span class="dot-orange"></span>ຄ້າງ</div>
                        </div>
                      </div>
                      <div class="cgc-body">
                        <canvas ref="barChartRef"></canvas>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="10" sm="8" md="6" lg="4" class="chart-slide-item">
                    <div class="chart-glass-card h-100">
                      <div class="cgc-header">
                        <div class="cgc-icon-wrap cgc-teal"><v-icon color="white" size="16">mdi-chart-donut</v-icon></div>
                        <div>
                          <div class="cgc-title">ສັດສ່ວນສະຖານະ</div>
                          <div class="cgc-sub">ຊຳລະ vs ຄ້າງຊຳລະ</div>
                        </div>
                      </div>
                      <div class="cgc-body cgc-donut-body">
                        <canvas ref="doughnutChartRef"></canvas>
                      </div>
                    </div>
                  </v-col>
                </v-row>

                <!-- Charts Row 2: Line -->
                <v-row class="mb-4" dense>
                  <v-col cols="12">
                    <div class="chart-glass-card">
                      <div class="cgc-header">
                        <div class="cgc-icon-wrap cgc-violet"><v-icon color="white" size="16">mdi-chart-line</v-icon></div>
                        <div>
                          <div class="cgc-title">ຍອດເງິນລວມ (LAK) ແຍກຕາມຜູ້ກູ້</div>
                          <div class="cgc-sub">ປຽບທຽບຈຳນວນເງິນລະຫວ່າງຜູ້ກູ້ທັງໝົດ</div>
                        </div>
                      </div>
                      <div class="cgc-body">
                        <canvas ref="lineChartRef"></canvas>
                      </div>
                    </div>
                  </v-col>
                </v-row>

                <!-- Detail Table -->
                <div class="chart-glass-card mb-2">
                  <div class="cgc-header">
                    <div class="cgc-icon-wrap cgc-slate"><v-icon color="white" size="16">mdi-table</v-icon></div>
                    <div>
                      <div class="cgc-title">ຕາຕະລາງລາຍລະອຽດ</div>
                      <div class="cgc-sub">ກົດເປີດເພື່ອເບິ່ງລາຍການທັງໝົດ</div>
                    </div>
                  </div>
                  <v-expansion-panels variant="accordion" class="modern-panels">
                    <v-expansion-panel v-for="r in reports" :key="r.borrower_id">
                      <v-expansion-panel-title>
                        <div class="detail-panel-header">
                          <div class="d-flex align-center gap-3">
                            <v-avatar size="36" color="indigo-lighten-4">
                              <span class="text-indigo-darken-3 font-weight-bold" style="font-size:13px;">{{ r.borrower.charAt(0) }}</span>
                            </v-avatar>
                            <div>
                              <div class="font-weight-bold text-indigo-darken-3" style="font-size:14px;">{{ r.borrower }}</div>
                              <div class="text-caption text-grey-darken-1">{{ r.b_number }}</div>
                            </div>
                          </div>
                          <div class="d-flex gap-1 flex-wrap">
                            <v-chip color="teal" variant="flat" size="x-small" class="font-weight-bold">
                              ✓ {{ r.records.filter(x => x.status === 'ok').length }}
                            </v-chip>
                            <v-chip color="deep-orange" variant="flat" size="x-small" class="font-weight-bold">
                              ! {{ r.records.filter(x => x.status !== 'ok').length }}
                            </v-chip>
                            <v-chip color="indigo" variant="flat" size="x-small" class="font-weight-bold">
                              {{ r.total_kg.toFixed(1) }}kg
                            </v-chip>
                          </div>
                        </div>
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <div class="table-scroll-wrapper">
                          <table class="detail-table">
                            <thead>
                              <tr>
                                <th>ວັນທີ</th>
                                <th>ກິດຈະກຳ</th>
                                <th class="text-right">ຈຳນວນ</th>
                                <th class="text-right">ກິໂລ</th>
                                <th class="text-center">ສະຖານະ</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="rec in r.records" :key="rec.key_id">
                                <td>{{ rec.borrow_date ? new Date(rec.borrow_date).toLocaleDateString('lo-LA') : '-' }}</td>
                                <td>{{ rec.activity_name }}</td>
                                <td class="text-right font-weight-medium">{{ formatNumber(rec.amount) }} {{ rec.currency }}</td>
                                <td class="text-right text-indigo font-weight-bold">{{ rec.kg ? rec.kg.toFixed(2) : '-' }}</td>
                                <td class="text-center">
                                  <span :class="rec.status === 'ok' ? 'badge-ok' : 'badge-pending'">
                                    {{ rec.status === 'ok' ? 'ຊຳລະ' : 'ຄ້າງ' }}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </div>
              </div>
            </v-window-item>

            <!-- 5. PROFILE SETTINGS TAB -->
            <v-window-item value="profile">
              <v-row class="px-2">
                <!-- Current User Info (Native App Header Style) -->
                <v-col cols="12" class="d-flex flex-column align-center text-center pt-8 pb-4">
                  <div class="position-relative mb-3" style="cursor: pointer;" @click="triggerProfileUpload">
                    <v-avatar size="100" color="indigo-lighten-5" class="elevation-2 border-sm border-white" style="border-width: 4px !important;">
                      <v-img v-if="profileForm.user_image || profileImagePreview" :src="profileImagePreview ? profileImagePreview : profileForm.user_image" cover @click.stop="openImageViewer(profileImagePreview ? profileImagePreview : profileForm.user_image)"></v-img>
                      <v-icon v-else size="60" color="indigo-darken-3">mdi-account</v-icon>
                    </v-avatar>
                    <v-btn icon="mdi-camera" size="small" color="indigo" class="position-absolute" style="bottom: 0; right: -5px; border: 3px solid white;" elevation="2" @click.stop="triggerProfileUpload"></v-btn>
                    <input type="file" ref="profileFileInputRef" accept="image/*" class="d-none" @change="onProfileImageSelected" />
                  </div>
                  <h2 class="text-h5 font-weight-bold text-grey-darken-4 mb-1">{{ user ? user.user_name : '-' }}</h2>
                  <v-chip color="indigo-lighten-5" text-color="indigo-darken-3" variant="flat" size="small" class="font-weight-bold mb-3 border border-indigo-lighten-4">
                    <v-icon start size="14" color="indigo-darken-3">mdi-shield-account</v-icon>
                    {{ user ? user.role : '-' }}
                  </v-chip>
                  <div class="text-body-2 text-grey-darken-1 d-flex align-center justify-center">
                    <v-icon size="16" class="me-1">mdi-phone</v-icon> {{ user ? user.user_tel : '-' }}
                  </div>
                  <div class="text-body-2 text-grey-darken-1 d-flex align-center justify-center mt-1">
                    <v-icon size="16" class="me-1">mdi-map-marker</v-icon> <span class="text-truncate d-inline-block" style="max-width: 250px;">{{ user ? user.user_address : '-' }}</span>
                  </div>
                </v-col>

                <!-- Update Profile Info Card -->
                <v-col cols="12" md="6" class="mt-2">
                  <div class="text-subtitle-2 font-weight-bold text-grey-darken-1 mb-2 ms-2 text-uppercase letter-spacing-1">ຂໍ້ມູນສ່ວນຕົວ</div>
                  <v-card elevation="0" class="rounded-xl border bg-white">
                    <v-card-text class="pa-4 pa-sm-5">
                      <v-form @submit.prevent="updateProfile">
                        <v-text-field v-model="profileForm.user_name" label="ຊື່ ແລະ ນາມສະກຸນ" variant="underlined" color="indigo" class="mb-2" prepend-inner-icon="mdi-account-outline" required hide-details="auto" />
                        <v-text-field v-model="profileForm.user_tel" label="ເບີໂທລະສັບ" variant="underlined" color="indigo" class="mb-2" prepend-inner-icon="mdi-phone-outline" required hide-details="auto" />
                        <v-textarea v-model="profileForm.user_address" label="ທີ່ຢູ່" variant="underlined" color="indigo" class="mb-6" prepend-inner-icon="mdi-map-marker-outline" rows="1" auto-grow required hide-details="auto" />
                        
                        <v-btn type="submit" color="indigo" rounded="pill" block class="font-weight-bold text-body-1" size="large" elevation="4" :loading="saving">
                          ບັນທຶກການແກ້ໄຂ
                        </v-btn>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- Update Password Card -->
                <v-col cols="12" md="6" class="mt-2 mt-md-2">
                  <div class="text-subtitle-2 font-weight-bold text-grey-darken-1 mb-2 ms-2 text-uppercase letter-spacing-1">ຄວາມປອດໄພ</div>
                  <v-card elevation="0" class="rounded-xl border bg-white">
                    <v-card-text class="pa-4 pa-sm-5">
                      <v-form @submit.prevent="updatePassword">
                        <v-text-field v-model="passwordForm.oldPassword" label="ລະຫັດຜ່ານເກົ່າ" :type="showOldPwd ? 'text' : 'password'" variant="underlined" color="teal" class="mb-2" prepend-inner-icon="mdi-lock-outline" :append-inner-icon="showOldPwd ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="showOldPwd = !showOldPwd" required hide-details="auto" />
                        <v-text-field v-model="passwordForm.newPassword" label="ລະຫັດຜ່ານໃໝ່" :type="showNewPwd ? 'text' : 'password'" variant="underlined" color="teal" class="mb-2" prepend-inner-icon="mdi-lock-open-outline" :append-inner-icon="showNewPwd ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="showNewPwd = !showNewPwd" required hide-details="auto" />
                        <v-text-field v-model="passwordForm.confirmPassword" label="ຢືນຢັນລະຫັດຜ່ານໃໝ່" :type="showConfirmPwd ? 'text' : 'password'" variant="underlined" color="teal" class="mb-6" prepend-inner-icon="mdi-lock-check-outline" :append-inner-icon="showConfirmPwd ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="showConfirmPwd = !showConfirmPwd" required hide-details="auto" />
                        
                        <v-btn type="submit" color="teal-darken-1" rounded="pill" block class="font-weight-bold text-white text-body-1" size="large" elevation="2" :loading="saving">
                          ປ່ຽນລະຫັດຜ່ານ
                        </v-btn>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- Reset Password by ID Card — Admin only -->
                <v-col v-if="user && user.role === 'admin'" cols="12" class="mt-2">
                  <div class="text-subtitle-2 font-weight-bold text-red-darken-2 mb-2 ms-2 text-uppercase letter-spacing-1">ADMIN ຣີເຊັດລະຫັດຜ່ານ</div>
                  <v-card elevation="0" class="rounded-xl border border-red-lighten-4 bg-white">
                    <v-card-text class="pa-4 pa-sm-5">
                      <v-form @submit.prevent="handleResetPasswordById">
                        <v-text-field v-model="resetPasswordForm.user_id" label="ລະຫັດຜູ້ໃຊ້ (User ID)" type="number" variant="underlined" color="red" class="mb-2" prepend-inner-icon="mdi-numeric" required hide-details="auto" />
                        <v-text-field v-model="resetPasswordForm.newPassword" label="ລະຫັດຜ່ານໃໝ່" :type="showResetNew ? 'text' : 'password'" variant="underlined" color="red" class="mb-2" prepend-inner-icon="mdi-lock-open-outline" :append-inner-icon="showResetNew ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="showResetNew = !showResetNew" required hide-details="auto" />
                        <v-text-field v-model="resetPasswordForm.confirmPassword" label="ຢືນຢັນລະຫັດຜ່ານໃໝ່" :type="showResetConfirm ? 'text' : 'password'" variant="underlined" color="red" class="mb-6" prepend-inner-icon="mdi-lock-check-outline" :append-inner-icon="showResetConfirm ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="showResetConfirm = !showResetConfirm" required hide-details="auto" />
                        <v-btn type="submit" color="red-darken-2" rounded="pill" block class="font-weight-bold text-body-1" size="large" elevation="2" :loading="saving">
                          ຢືນຢັນການຣີເຊັດລະຫັດຜ່ານ
                        </v-btn>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- 6. ADMIN USER MANAGEMENT TAB -->
            <v-window-item value="admin">
              <v-card elevation="2" class="rounded-xl overflow-hidden">
                <v-card-title class="px-6 py-4 d-flex align-center justify-space-between" style="background: linear-gradient(90deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%);">
                  <div class="d-flex align-center text-white">
                    <v-icon class="me-3" size="26">mdi-shield-crown</v-icon>
                    <div>
                      <div class="text-h6 font-weight-bold">ຈັດການຜູ້ໃຊ້ທັງໝົດ</div>
                      <div class="text-caption opacity-70">ສະເພາະ Admin ເທົ່ານັ້ນ</div>
                    </div>
                  </div>
                  <v-btn color="white" variant="tonal" prepend-icon="mdi-refresh" size="small" @click="fetchAllUsers" :loading="loadingUsers">
                    ໂຫຼດຂໍ້ມູນໃໝ່
                  </v-btn>
                </v-card-title>

                <v-card-text class="pa-4">
                  <!-- Summary chips -->
                  <div class="d-flex gap-3 mb-4 flex-wrap">
                    <v-chip color="indigo" variant="tonal" class="font-weight-bold">
                      <v-icon start>mdi-account-multiple</v-icon>
                      ທັງໝົດ: {{ allUsers.length }} ຄົນ
                    </v-chip>
                    <v-chip color="red-darken-2" variant="tonal" class="font-weight-bold">
                      <v-icon start>mdi-shield-account</v-icon>
                      Admin: {{ allUsers.filter(u => u.role === 'admin').length }} ຄົນ
                    </v-chip>
                    <v-chip color="teal" variant="tonal" class="font-weight-bold">
                      <v-icon start>mdi-account</v-icon>
                      User: {{ allUsers.filter(u => u.role === 'user').length }} ຄົນ
                    </v-chip>
                  </div>

                  <v-table hover class="rounded-lg">
                    <thead>
                      <tr style="background: #f1f5f9;">
                        <th class="font-weight-bold text-subtitle-2 text-indigo-darken-3">ID</th>
                        <th class="font-weight-bold text-subtitle-2 text-indigo-darken-3">ຊື່ຜູ້ໃຊ້</th>
                        <th class="font-weight-bold text-subtitle-2 text-indigo-darken-3">ເບີໂທ</th>
                        <th class="font-weight-bold text-subtitle-2 text-indigo-darken-3">ທີ່ຢູ່</th>
                        <th class="font-weight-bold text-subtitle-2 text-indigo-darken-3 text-center">ສິດທິ</th>
                        <th class="font-weight-bold text-subtitle-2 text-indigo-darken-3 text-center" style="width: 180px;">ຈັດການ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="u in allUsers" :key="u.user_id" :class="u.user_id === user?.user_id ? 'bg-indigo-lighten-5' : ''">
                        <td class="text-caption text-grey-darken-1 font-weight-bold">#{{ u.user_id }}</td>
                        <td>
                          <div class="d-flex align-center">
                            <v-avatar size="32" :color="u.role === 'admin' ? 'deep-purple' : 'teal'" class="me-2" :style="u.user_image ? 'cursor: pointer;' : ''">
                              <v-img v-if="u.user_image" :src="u.user_image" cover @click.stop="openImageViewer(u.user_image)"></v-img>
                              <v-icon v-else size="18" color="white">{{ u.role === 'admin' ? 'mdi-shield-account' : 'mdi-account' }}</v-icon>
                            </v-avatar>
                            <div>
                              <div class="font-weight-medium">{{ u.user_name }}</div>
                              <div v-if="u.user_id === user?.user_id" class="text-caption text-indigo font-weight-bold">(ທ່ານ)</div>
                            </div>
                          </div>
                        </td>
                        <td class="text-body-2">{{ u.user_tel }}</td>
                        <td class="text-body-2 text-grey-darken-1">{{ u.user_address }}</td>
                        <td class="text-center">
                          <v-chip
                            :color="u.role === 'admin' ? 'deep-purple' : 'teal'"
                            size="small"
                            variant="flat"
                            class="font-weight-bold"
                          >
                            {{ u.role === 'admin' ? '🔰 Admin' : '👤 User' }}
                          </v-chip>
                        </td>
                        <td class="text-center">
                          <div v-if="u.user_id !== user?.user_id" class="d-flex justify-center gap-1">
                            <!-- Toggle Role Button -->
                            <v-btn
                              :color="u.role === 'admin' ? 'teal' : 'deep-purple'"
                              variant="tonal"
                              size="x-small"
                              :title="u.role === 'admin' ? 'ປ່ຽນເປັນ User' : 'ປ່ຽນເປັນ Admin'"
                              @click="toggleUserRole(u)"
                              :loading="u._loadingRole"
                            >
                              <v-icon size="14">{{ u.role === 'admin' ? 'mdi-account-arrow-down' : 'mdi-update' }}</v-icon>
                            </v-btn>
                            <!-- Reset Password Button -->
                            <v-btn
                              color="orange-darken-2"
                              variant="tonal"
                              size="x-small"
                              title="ຣີເຊັດລະຫັດຜ່ານ"
                              @click="openAdminResetDialog(u)"
                            >
                              <v-icon size="14">mdi-lock-reset</v-icon>
                            </v-btn>
                            <!-- Delete Button -->
                            <v-btn
                              color="red"
                              variant="tonal"
                              size="x-small"
                              title="ລົບຜູ້ໃຊ້"
                              @click="confirmDeleteUser(u)"
                              :loading="u._loadingDelete"
                            >
                              <v-icon size="14">mdi-delete</v-icon>
                            </v-btn>
                          </div>
                          <v-chip v-else size="x-small" color="indigo" variant="outlined">ທ່ານ</v-chip>
                        </td>
                      </tr>
                      <tr v-if="allUsers.length === 0">
                        <td colspan="6" class="text-center py-6 text-grey">
                          <v-icon size="40" color="grey-lighten-2">mdi-account-off-outline</v-icon>
                          <div class="mt-2">ບໍ່ມີຂໍ້ມູນຜູ້ໃຊ້</div>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-card-text>
              </v-card>
            </v-window-item>

          </v-window>
        </v-container>
      </v-main>

      <!-- DIALOG: Admin Reset User Password -->
      <v-dialog v-model="adminResetDialog" max-width="420">
        <v-card class="rounded-xl pa-3">
          <v-card-title class="font-weight-bold text-orange-darken-3 d-flex align-center">
            <v-icon class="me-2">mdi-lock-reset</v-icon>
            ຣີເຊັດລະຫັດຜ່ານ
          </v-card-title>
          <v-card-subtitle class="pt-1 pb-2 text-grey-darken-1">
            ຜູ້ໃຊ້: <strong>{{ adminResetTarget?.user_name }}</strong> (ID: {{ adminResetTarget?.user_id }})
          </v-card-subtitle>
          <v-card-text class="pt-2">
            <v-text-field
              v-model="adminResetNewPassword"
              label="ລະຫັດຜ່ານໃໝ່"
              :type="showAdminNew ? 'text' : 'password'"
              :append-inner-icon="showAdminNew ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showAdminNew = !showAdminNew"
              variant="outlined"
              density="comfortable"
              class="mb-3"
              prepend-inner-icon="mdi-lock-open"
              hint="ຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ"
              persistent-hint
            />
            <v-text-field
              v-model="adminResetConfirmPassword"
              label="ຢືນຢັນລະຫັດຜ່ານໃໝ່"
              :type="showAdminConfirm ? 'text' : 'password'"
              :append-inner-icon="showAdminConfirm ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showAdminConfirm = !showAdminConfirm"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-lock-check"
              :error="adminResetNewPassword !== adminResetConfirmPassword && adminResetConfirmPassword.length > 0"
              :error-messages="adminResetNewPassword !== adminResetConfirmPassword && adminResetConfirmPassword.length > 0 ? 'ລະຫັດຜ່ານບໍ່ກົງກັນ' : ''"
            />
          </v-card-text>
          <v-card-actions class="px-6 pb-3">
            <v-btn variant="text" @click="adminResetDialog = false">ຍົກເລີກ</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="orange-darken-2"
              variant="elevated"
              :loading="saving"
              @click="submitAdminReset"
              class="font-weight-bold px-4"
              :disabled="!adminResetNewPassword || adminResetNewPassword !== adminResetConfirmPassword"
            >
              ຣີເຊັດລະຫັດຜ່ານ
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- DIALOG: Activity INSERT / UPDATE -->
      <v-dialog v-model="activityDialog" max-width="420">
        <v-card class="rounded-xl pa-3">
          <v-card-title class="font-weight-bold text-indigo d-flex align-center">
            <v-icon class="me-2">mdi-lightning-bolt</v-icon>
            {{ editingActivityId ? 'ແກ້ໄຂກິດຈະກຳ' : 'ເພີ່ມກິດຈະກຳ' }}
          </v-card-title>
          <v-card-text class="pt-2">
            <v-text-field v-model="activityForm.activity_name" label="ຊື່ກິດຈະກຳ" variant="outlined" density="comfortable" prepend-inner-icon="mdi-pencil-outline" />
          </v-card-text>
          <v-card-actions class="px-6 pb-3">
            <v-btn variant="text" @click="activityDialog = false">ຍົກເລີກ</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="indigo" variant="elevated" :loading="saving" @click="saveActivity" class="font-weight-bold px-4">ບັນທຶກ</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- DIALOG: Borrower INSERT / UPDATE -->
      <v-dialog v-model="borrowerDialog" max-width="450">
        <v-card class="rounded-xl pa-3">
          <v-card-title class="font-weight-bold text-indigo d-flex align-center">
            <v-icon class="me-2">mdi-account</v-icon>
            {{ editingBorrowerId ? 'ແກ້ໄຂຂໍ້ມູນຜູ້ກູ້ຢືມ' : 'ເພີ່ມຜູ້ກູ້ຢືມ' }}
          </v-card-title>
          <v-card-text class="pt-2">
            <div class="text-center mb-4">
              <v-avatar size="80" color="grey-lighten-3" class="mb-2" style="cursor: pointer;">
                <v-img v-if="borrowerForm.b_image || borrowerImagePreview" :src="borrowerImagePreview ? borrowerImagePreview : borrowerForm.b_image" cover @click="openImageViewer(borrowerImagePreview ? borrowerImagePreview : borrowerForm.b_image)"></v-img>
                <v-icon v-else size="40" color="grey" @click="$refs.borrowerFileInputRef && $refs.borrowerFileInputRef.click()">mdi-camera</v-icon>
              </v-avatar>
              <v-file-input ref="borrowerFileInputRef" v-model="borrowerImageFile" label="ອັບໂຫຼດຮູບພາບ" variant="outlined" density="compact" accept="image/*" prepend-icon="" prepend-inner-icon="mdi-camera" show-size hide-details @update:modelValue="onBorrowerImageSelected"></v-file-input>
            </div>
            <v-text-field v-model="borrowerForm.b_name" label="ຊື່ ແລະ ນາມສະກຸນ" variant="outlined" density="comfortable" class="mb-3" prepend-inner-icon="mdi-account-outline" />
            <v-text-field v-model="borrowerForm.b_number" label="ເບີໂທລະສັບ" variant="outlined" density="comfortable" class="mb-3" prepend-inner-icon="mdi-phone-outline" />
            <v-textarea v-model="borrowerForm.b_address" label="ທີ່ຢູ່" variant="outlined" density="comfortable" prepend-inner-icon="mdi-map-marker-outline" rows="3" />
          </v-card-text>
          <v-card-actions class="px-6 pb-3">
            <v-btn variant="text" @click="borrowerDialog = false">ຍົກເລີກ</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="indigo" variant="elevated" :loading="saving" @click="saveBorrower" class="font-weight-bold px-4">ບັນທຶກ</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- DIALOG: Image Viewer -->
      <v-dialog v-model="imageViewerDialog" max-width="800">
        <v-card class="bg-black" rounded="xl">
          <v-card-title class="d-flex justify-end pa-2">
            <v-btn icon="mdi-close" variant="text" color="white" @click="imageViewerDialog = false"></v-btn>
          </v-card-title>
          <v-card-text class="pa-0 d-flex justify-center align-center" style="height: 60vh;">
            <v-img :src="imageViewerSrc" contain style="max-height: 100%; max-width: 100%;"></v-img>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- DIALOG: Profit Calculation -->
      <v-dialog v-model="profitDialog" max-width="450">
        <v-card class="rounded-xl pa-2">
          <v-card-title class="font-weight-bold text-success d-flex align-center">
            <v-icon class="me-2">mdi-calculator</v-icon>
            ຄຳນວນກຳໄລ ແລະ ຂາດທຶນ
          </v-card-title>
          <v-card-text>
            <p class=" text-grey-darken-1 mb-4">
              ປ້ອນລາຄາປັດຈຸບັນຂອງ 12kg ເພື່ອຄິດໄລ່ຫາກຳໄລ ຫຼື ຂາດທຶນ ຈາກນ້ຳໜັກທັງໝົດໃນລະບົບ (ລວມທັງທີ່ໄດ້ຮັບແລ້ວ ແລະ ຍັງຄ້າງຮັບ).
            </p>
            <v-text-field
              v-model.number="currentPrice12Kg"
              label="ລາຄາປັດຈຸບັນ ຕໍ່ 12kg (LAK)"
              type="number"
              variant="outlined"
              density="comfortable"
              class="mb-2"
              @update:model-value="calculateProfit"
            />

            <div v-if="calculatedProfit" ref="profitCardRef" class="mt-4 pa-6 bg-white mx-auto fade-in rounded-xl" style="background-color: #ffffff !important; box-shadow: 0 4px 20px rgba(0,0,0,0.08); position: relative; overflow: hidden; max-width: 400px;">
              <!-- Bill Header -->
              <div class="text-center mb-5">
                <div class="d-inline-flex align-center justify-center bg-indigo-lighten-5 rounded-circle mb-3" style="width: 54px; height: 54px;">
                  <v-icon color="indigo" size="30">mdi-store-check-outline</v-icon>
                </div>
                <h3 class="font-weight-bold text-indigo-darken-3 mb-1" style="font-size: 20px;">ບິນສະຫຼຸບກຳໄລ-ຂາດທຶນ</h3>
                <div class=" text-grey">ລະບົບຈັດການເງິນກູ້ ແລະ ບັນຊີ</div>
              </div>
              
              <!-- Info section -->
              <div class="mb-4 text-body-2 px-1">
                <div class="d-flex justify-space-between mb-2">
                  <span class="text-grey-darken-1">ເຈົ້າຂອງບິນ:</span>
                  <span class="font-weight-bold text-indigo">{{ user ? user.user_name : 'ຜູ້ໃຊ້' }}</span>
                </div>
                <div class="d-flex justify-space-between mb-2">
                  <span class="text-grey-darken-1">ວັນທີ:</span>
                  <span class="font-weight-medium">{{ new Date().toLocaleString('lo-LA') }}</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="text-grey-darken-1">ລາຄາອ້າງອີງ (12kg):</span>
                  <span class="font-weight-bold text-teal">{{ formatNumber(currentPrice12Kg) }} LAK</span>
                </div>
              </div>

              <!-- Dashed line -->
              <div style="border-top: 2px dashed #e0e0e0; margin: 16px 0;"></div>

              <!-- Main Calculation Data -->
              <div class="mb-4 px-1">
                <div class="d-flex justify-space-between mb-3">
                  <span class="text-grey-darken-2">ຕົ້ນທຶນປ່ອຍກູ້ລວມ:</span>
                  <span class="font-weight-medium">{{ formatNumber(calculatedProfit.totalCost) }} LAK</span>
                </div>
                <div class="d-flex justify-space-between mb-3">
                  <span class="text-grey-darken-2">ນ້ຳໜັກຮັບ+ຄ້າງລວມ:</span>
                  <span class="font-weight-medium">{{ calculatedProfit.totalKg.toFixed(2) }} kg</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="text-grey-darken-2">ມູນຄ່າປັດຈຸບັນ:</span>
                  <span class="font-weight-bold text-indigo">{{ formatNumber(calculatedProfit.currentValue) }} LAK</span>
                </div>
              </div>

              <!-- Dashed line -->
              <div style="border-top: 2px dashed #e0e0e0; margin: 16px 0;"></div>

              <!-- Summary -->
              <div class="d-flex flex-column align-center mt-5 mb-2">
                <span class=" text-grey-darken-2 mb-3">ຜົນສະຫຼຸບສຸດທິ</span>
                
                <v-chip
                  :color="calculatedProfit.profit >= 0 ? 'success' : 'error'"
                  variant="flat"
                  class="font-weight-bold mb-3 w-100 justify-center py-5"
                  style="height: auto; font-size: 18px;"
                >
                  <v-icon start size="28" class="me-2">{{ calculatedProfit.profit >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}</v-icon>
                  {{ calculatedProfit.profit >= 0 ? 'ກຳໄລ' : 'ຂາດທຶນ' }} {{ formatNumber(Math.abs(calculatedProfit.profit)) }} LAK
                </v-chip>
                
                <v-chip
                  :color="calculatedProfit.profit >= 0 ? 'success' : 'error'"
                  variant="tonal"
                  class="font-weight-bold w-100 justify-center py-4"
                  size="default"
                >
                  <v-icon start size="20" class="me-2">mdi-weight-kilogram</v-icon>
                  {{ calculatedProfit.profit >= 0 ? 'ກຳໄລ' : 'ຂາດທຶນ' }} {{ Math.abs(calculatedProfit.profitKg).toFixed(2) }} kg
                </v-chip>
              </div>

              <!-- Bill Footer -->
              <div class="text-center mt-6 pt-2">
                <div class=" text-grey">ຂອບໃຈທີ່ໃຊ້ບໍລິການ</div>
              </div>
            </div>

            <div v-if="calculatedProfit" class="d-flex justify-center mt-4">
              <v-btn color="indigo" variant="flat" prepend-icon="mdi-download" @click="downloadProfitImage" :loading="downloadingImage" class="px-6 rounded-lg font-weight-bold">
                ບັນທຶກເປັນຮູບພາບ
              </v-btn>
            </div>
          </v-card-text>
          <v-card-actions class="px-6 pb-4">
            <v-spacer></v-spacer>
            <v-btn color="grey-darken-1" variant="text" @click="profitDialog = false">ປິດ</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- DIALOG: Loan/Accounting INSERT / UPDATE -->
      <v-dialog v-model="loanDialog" max-width="500">
        <v-card class="rounded-xl pa-3">
          <v-card-title class="font-weight-bold text-indigo d-flex align-center">
            <v-icon class="me-2">mdi-cash-register</v-icon>
            {{ editingLoanId ? 'ແກ້ໄຂບິນເງິນກູ້' : 'ບັນທຶກບິນເງินກູ້ໃໝ່' }}
          </v-card-title>
          
          <v-card-text class="pt-2">
            <v-select v-model="loanForm.Borrower_id" :items="borrowerOptions" item-title="title" item-value="value" label="ເລືອກຜູ້ກູ້ຢືມ" variant="outlined" density="comfortable" class="mb-3" />
            <v-select v-model="loanForm.a_id" :items="activityOptions" item-title="title" item-value="value" label="ເລືອກປະເພດກິດຈະກຳ" variant="outlined" density="comfortable" class="mb-3" />
            
            <v-row class="mb-1">
              <v-col cols="8">
                <v-text-field v-model.number="loanForm.amount" label="ຈຳນວນເງິນກູ້" type="number" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="4">
                <v-select v-model="loanForm.currency" :items="['LAK', 'THB', 'USD']" label="สกุลเงิน" variant="outlined" density="comfortable" />
              </v-col>
            </v-row>

            <v-text-field v-model.number="loanForm.amount_per_kg" label="ລາຄາຕໍ່ 12 กิโลกรัม (amount_per_kg)" type="number" variant="outlined" density="comfortable" class="mb-3" />
            <v-text-field v-model="loanForm.borrow_date" label="ວັນທີກູ້ຢືມ (YYYY-MM-DD)" type="date" variant="outlined" density="comfortable" class="mb-3" />

            <!-- Equivalent weight helper inside dialog -->
            <div v-if="computedWeight > 0" class="bg-indigo-lighten-5 pa-3 rounded-lg text-center mt-2">
              <span class="text-caption text-indigo-darken-4 font-weight-medium">ນ້ຳໜັກຄິດໄລ່ໄດ້: </span>
              <span class="font-weight-bold text-indigo">{{ computedWeight.toFixed(2) }} kg</span>
            </div>
          </v-card-text>
          
          <v-card-actions class="px-6 pb-3">
            <v-btn variant="text" @click="loanDialog = false">ຍົກເລີກ</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="indigo" variant="elevated" :loading="saving" @click="saveLoan" class="font-weight-bold px-4">ບັນທຶກ</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="globalConfirmDialog" max-width="400" persistent z-index="9999">
        <v-card class="rounded-xl shadow-card text-center pb-2" elevation="4" style="font-family: 'Noto Sans Lao', 'Phetsarath OT', sans-serif !important;">
          <div class="pt-8 pb-2">
            <v-icon color="warning" size="64" class="mb-3">mdi-alert-circle-outline</v-icon>
            <h3 class="text-h6 font-weight-bold text-grey-darken-3" style="font-family: 'Noto Sans Lao', 'Phetsarath OT', sans-serif !important;">{{ globalConfirmTitle }}</h3>
          </div>
          <v-card-text class="text-subtitle-1 text-medium-emphasis px-6 pt-0 pb-6" style="line-height: 1.6; font-family: 'Noto Sans Lao', 'Phetsarath OT', sans-serif !important;" v-html="globalConfirmMessage"></v-card-text>
          <v-card-actions class="d-flex justify-center px-6 pb-4">
            <v-btn variant="outlined" color="grey-darken-1" rounded="lg" class="px-6 mx-2" @click="globalConfirmDialog = false" :disabled="savingStatus" style="font-family: 'Noto Sans Lao', sans-serif !important;">ຍົກເລີກ</v-btn>
            <v-btn color="indigo" variant="flat" rounded="lg" class="px-8 mx-2 font-weight-bold" @click="executeGlobalConfirm" :loading="savingStatus" style="font-family: 'Noto Sans Lao', sans-serif !important;">ຕົກລົງ</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Global Snackbar Alerts -->
      <v-snackbar v-model="snack.show" :color="snack.color" :timeout="3000" rounded="pill">
        {{ snack.text }}
        <template v-slot:actions>
          <v-btn variant="text" @click="snack.show = false">ປິດ</v-btn>
        </template>
      </v-snackbar>
    </v-app>
  </client-only>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useNuxtApp } from '#app'
import html2canvas from 'html2canvas'
import {
  Chart,
  BarElement, CategoryScale, LinearScale, BarController,
  DoughnutController, ArcElement,
  LineElement, PointElement, LineController,
  Tooltip, Legend, Filler
} from 'chart.js'

Chart.register(
  BarElement, CategoryScale, LinearScale, BarController,
  DoughnutController, ArcElement,
  LineElement, PointElement, LineController,
  Tooltip, Legend, Filler
)

const router = useRouter()
const { $api } = useNuxtApp()
const config = useRuntimeConfig()

// Core Reactive States
const activeTab = ref('dashboard')
const user = ref(null)
const activities = ref([])
const borrowers = ref([])
const loans = ref([])
const reports = ref([])
const loading = ref(false)
const loadingReports = ref(false)
const proLoansNplCount = ref(0)

// Chart canvas refs
const barChartRef = ref(null)
const doughnutChartRef = ref(null)
const lineChartRef = ref(null)
let barChartInstance = null
let doughnutChartInstance = null
let lineChartInstance = null
const saving = ref(false)

// Global Confirmation Dialog State
const globalConfirmDialog = ref(false)
const globalConfirmTitle = ref('')
const globalConfirmMessage = ref('')
const globalConfirmAction = ref(null)
const savingStatus = ref(false)

const requestConfirm = (title, message, action) => {
  globalConfirmTitle.value = title
  globalConfirmMessage.value = message
  globalConfirmAction.value = action
  globalConfirmDialog.value = true
}

const executeGlobalConfirm = async () => {
  if (!globalConfirmAction.value) return
  savingStatus.value = true
  try {
    await globalConfirmAction.value()
  } finally {
    savingStatus.value = false
    globalConfirmDialog.value = false
  }
}

// Token storage
const tokenRef = ref('')

// Filter states
const loanFilterStatus = ref('all')

// Activity Form States
const activityDialog = ref(false)
const editingActivityId = ref(null)
const activityForm = ref({ activity_name: '' })

// Borrower Form States
const borrowerDialog = ref(false)
const editingBorrowerId = ref(null)
const borrowerForm = ref({ b_name: '', b_number: '', b_address: '' })

// Loan Form States
const loanDialog = ref(false)
const editingLoanId = ref(null)
const loanStatus = ref('indebted')
const loanForm = ref({
  a_id: null,
  Borrower_id: null,
  amount: 0,
  currency: 'LAK',
  amount_per_kg: 0,
  borrow_date: ''
})

// Quick Calculator States
const calcPricePer12 = ref(0)
const calcKg = ref(0)
const calcResult = ref(null)
const calculating = ref(false)

// Profile Settings Form States
const profileForm = ref({ user_name: '', user_tel: '', user_address: '', user_image: '' })
const passwordForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' })
const resetPasswordForm = ref({ user_id: '', newPassword: '', confirmPassword: '' })

// Admin User Management States
const allUsers = ref([])
const loadingUsers = ref(false)
const adminResetDialog = ref(false)
const adminResetTarget = ref(null)
const adminResetNewPassword = ref('')
const adminResetConfirmPassword = ref('')

// Password visibility toggles
const showOldPwd = ref(false)
const showNewPwd = ref(false)
const showConfirmPwd = ref(false)
const showResetNew = ref(false)
const showResetConfirm = ref(false)
const showAdminNew = ref(false)
const showAdminConfirm = ref(false)

// Alerts / Snackbar State
const snack = ref({ show: false, text: '', color: 'success' })

// Trigger helper message
const showToast = (text, color = 'success') => {
  snack.value = { show: true, text, color }
}

// Compute dynamic equivalent weight in loan form dialog
const computedWeight = computed(() => {
  if (!loanForm.value.amount || !loanForm.value.amount_per_kg) return 0
  return (Number(loanForm.value.amount) / Number(loanForm.value.amount_per_kg)) * 12
})

// Global KPIs from Reports data to prevent missing data when loans are filtered
const indebtedLoansCount = computed(() => {
  return reports.value.reduce((sum, r) => sum + r.records.filter(x => x.status !== 'ok').length, 0)
})

const homeKgReceived = computed(() => {
  return reports.value.reduce((sum, r) => sum + r.records.filter(x => x.status === 'ok').reduce((s, x) => s + (x.kg || 0), 0), 0)
})

const homeKgIndebted = computed(() => {
  return reports.value.reduce((sum, r) => sum + r.records.filter(x => x.status !== 'ok').reduce((s, x) => s + (x.kg || 0), 0), 0)
})

const homeAmountReceived = computed(() => {
  return reports.value.reduce((sum, r) => sum + r.records.filter(x => x.status === 'ok').reduce((s, x) => s + (Number(x.amount) || 0), 0), 0)
})

const homeAmountIndebted = computed(() => {
  return reports.value.reduce((sum, r) => sum + r.records.filter(x => x.status !== 'ok').reduce((s, x) => s + (Number(x.amount) || 0), 0), 0)
})

// Profit Calculator Logic
const profitDialog = ref(false)
const currentPrice12Kg = ref(null)
const calculatedProfit = ref(null)
const profitCardRef = ref(null)
const downloadingImage = ref(false)

const downloadProfitImage = async () => {
  if (!profitCardRef.value) return
  downloadingImage.value = true
  try {
    const canvas = await html2canvas(profitCardRef.value, {
      scale: 2,
      backgroundColor: '#f5f5f5'
    })
    const image = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = image
    link.download = `profit_report_${new Date().getTime()}.png`
    link.click()
    showToast('ດາວໂຫຼດຮູບພາບສຳເລັດແລ້ວ')
  } catch (error) {
    console.error('Error generating image:', error)
    showToast('ເກີດຂໍ້ຜິດພາດໃນການສ້າງຮູບພາບ', 'error')
  } finally {
    downloadingImage.value = false
  }
}

const calculateProfit = () => {
  if (!currentPrice12Kg.value) {
    calculatedProfit.value = null
    return
  }
  const price = Number(currentPrice12Kg.value)
  const pricePerKg = price / 12
  const totalKg = homeKgReceived.value + homeKgIndebted.value
  const totalCost = homeAmountReceived.value + homeAmountIndebted.value
  
  const currentValue = totalKg * pricePerKg
  const profit = currentValue - totalCost
  const profitKg = profit / pricePerKg

  calculatedProfit.value = {
    totalKg,
    totalCost,
    currentValue,
    profit,
    profitKg
  }
}

// Report KPI computed
const reportTotalKg = computed(() => reports.value.reduce((sum, r) => sum + (r.total_kg || 0), 0))
const reportIndebtedCount = computed(() => {
  return reports.value.reduce((sum, r) => sum + r.records.filter(x => x.status !== 'ok').length, 0)
})

// Build and render charts
const renderCharts = async () => {
  await nextTick()
  if (!reports.value.length) return

  const labels = reports.value.map(r => r.borrower)
  const paidKg = reports.value.map(r => r.records.filter(x => x.status === 'ok').reduce((s, x) => s + (x.kg || 0), 0))
  const indebtKg = reports.value.map(r => r.records.filter(x => x.status !== 'ok').reduce((s, x) => s + (x.kg || 0), 0))
  const totalAmounts = reports.value.map(r => r.records.reduce((s, x) => s + (Number(x.amount) || 0), 0))
  const totalPaid = reports.value.reduce((s, r) => s + r.records.filter(x => x.status === 'ok').length, 0)
  const totalIndebted = reports.value.reduce((s, r) => s + r.records.filter(x => x.status !== 'ok').length, 0)

  const chartDefaults = {
    plugins: { legend: { labels: { font: { family: 'Noto Sans Lao, Inter, sans-serif', size: 12 }, color: '#475569' } } }
  }

  // --- Bar Chart ---
  if (barChartRef.value) {
    if (barChartInstance) barChartInstance.destroy()
    barChartInstance = new Chart(barChartRef.value, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'ຊຳລະແລ້ວ (kg)', data: paidKg, backgroundColor: 'rgba(16,185,129,0.75)', borderRadius: 8, borderSkipped: false },
          { label: 'ຄ້າງຊຳລະ (kg)', data: indebtKg, backgroundColor: 'rgba(249,115,22,0.75)', borderRadius: 8, borderSkipped: false }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { ...chartDefaults.plugins, tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.raw.toFixed(2)} kg` } } },
        scales: {
          x: { stacked: false, grid: { display: false }, ticks: { font: { family: 'Noto Sans Lao, Inter', size: 11 }, color: '#64748b' } },
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { family: 'Noto Sans Lao, Inter', size: 11 }, color: '#64748b' } }
        }
      }
    })
  }

  // --- Doughnut Chart ---
  if (doughnutChartRef.value) {
    if (doughnutChartInstance) doughnutChartInstance.destroy()
    doughnutChartInstance = new Chart(doughnutChartRef.value, {
      type: 'doughnut',
      data: {
        labels: ['ຊຳລະແລ້ວ', 'ຄ້າງຊຳລະ'],
        datasets: [{ data: [totalPaid, totalIndebted], backgroundColor: ['rgba(16,185,129,0.8)', 'rgba(249,115,22,0.8)'], borderWidth: 0, hoverOffset: 10 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '68%',
        plugins: {
          ...chartDefaults.plugins,
          tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw} ລາຍການ` } }
        }
      }
    })
  }

  // --- Line Chart ---
  if (lineChartRef.value) {
    if (lineChartInstance) lineChartInstance.destroy()
    lineChartInstance = new Chart(lineChartRef.value, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'ຈຳນວນເງິນລວມ (LAK)',
          data: totalAmounts,
          borderColor: 'rgba(99,102,241,1)',
          backgroundColor: 'rgba(99,102,241,0.1)',
          borderWidth: 2.5,
          pointBackgroundColor: 'rgba(99,102,241,1)',
          pointRadius: 5,
          pointHoverRadius: 8,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { ...chartDefaults.plugins, tooltip: { callbacks: { label: ctx => ` ${Number(ctx.raw).toLocaleString()} LAK` } } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: 'Noto Sans Lao, Inter', size: 11 }, color: '#64748b' } },
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { family: 'Noto Sans Lao, Inter', size: 11 }, color: '#64748b', callback: v => Number(v).toLocaleString() } }
        }
      }
    })
  }
}

// Render charts when data loads while Reports tab is already active
watch(reports, async () => {
  if (reports.value.length && activeTab.value === 'reports') {
    await nextTick()
    renderCharts()
  }
}, { flush: 'post' })

// Render charts when user SWITCHES to the Reports tab (canvas just became available)
watch(activeTab, async (newTab) => {
  if (newTab === 'reports' && reports.value.length) {
    await nextTick()
    renderCharts()
  }
})

// Options list maps for Select dropdown components
const borrowerOptions = computed(() => {
  return borrowers.value.map(b => ({
    title: `${b.b_name} (${b.b_number})`,
    value: b.b_id
  }))
})

const activityOptions = computed(() => {
  return activities.value.map(a => ({
    title: a.activity_name,
    value: a.a_id
  }))
})

// ----------------- LIFECYCLE MOUNTED -----------------
onMounted(async () => {
  const localToken = localStorage.getItem('token')
  if (!localToken) {
    router.push('/')
    return
  }
  tokenRef.value = localToken

  // Initialize and verify user profile details
  await fetchProfile()
  
  if (user.value) {
    // Populate layout forms
    profileForm.value = {
      user_name: user.value.user_name || '',
      user_tel: user.value.user_tel || '',
      user_address: user.value.user_address || '',
      user_image: user.value.user_image || ''
    }

    // Load entire database lists
    loading.value = true
    const fetchPromises = [fetchActivities(), fetchBorrowers(), fetchLoans(), fetchReports()]
    if (user.value.role === 'admin') {
      fetchPromises.push(fetchAllUsers())
    }
    await Promise.all(fetchPromises)
    loading.value = false
  }
})

// ----------------- API CALL METHODS -----------------

// 1. User profile authentication
const fetchProfile = async () => {
  try {
    const res = await $api.post('/auth/getUser', { token: tokenRef.value })
    if (res.data.status === "00") {
      user.value = res.data.user
    } else {
      handleSessionError()
    }
  } catch (err) {
    console.error('Verify User Error:', err)
    handleSessionError()
  }
}

const handleSessionError = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user_name')
  showToast('ເຊດຊັນໝົດອາຍຸ ຫຼື ຂໍ້ມູນບໍ່ຖືກຕ້ອງ ກະລຸນາເຂົ້າລະບົບໃໝ່', 'error')
  router.push('/')
}

// 2. Fetch Activity Types
const fetchActivities = async () => {
  try {
    const res = await $api.post('/activity/show', { token: tokenRef.value })
    if (res.data.status === "00") {
      activities.value = res.data.activities
    }
  } catch (err) {
    console.error('Fetch activities error:', err)
  }
}

// 3. Fetch Borrowers
const fetchBorrowers = async () => {
  try {
    const res = await $api.post('/borrower/show', { token: tokenRef.value })
    if (res.data.status === "00") {
      borrowers.value = res.data.data
    }
  } catch (err) {
    console.error('Fetch borrowers error:', err)
  }
}

// 4. Fetch Loans List
const fetchLoans = async () => {
  try {
    const payload = { token: tokenRef.value }
    if (loanFilterStatus.value !== 'all') {
      payload.status = loanFilterStatus.value
    }
    const res = await $api.post('/accounting/show', payload)
    if (res.data.status === "00") {
      loans.value = res.data.data
    }
  } catch (err) {
    console.error('Fetch loans error:', err)
  }
}

const goToLoanDetails = async (status) => {
  activeTab.value = 'loans'
  loanFilterStatus.value = status
  await fetchLoans()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 5. Fetch Summary Reports
const fetchReports = async () => {
  try {
    const res = await $api.post('/accounting/report', { token: tokenRef.value })
    if (res.data.status === "00") {
      reports.value = res.data.data
    }
  } catch (err) {
    console.error('Fetch reports error:', err)
  }
}

// ----------------- CRUD SUBMISSION HANDLERS -----------------

// ACTIVITY DIALOG POPUP
const openActivityDialog = (item) => {
  if (item) {
    editingActivityId.value = item.a_id
    activityForm.value = { activity_name: item.activity_name }
  } else {
    editingActivityId.value = null
    activityForm.value = { activity_name: '' }
  }
  activityDialog.value = true
}

// Save/Edit Activity Type
const saveActivity = async () => {
  if (!activityForm.value.activity_name) return
  
  const actionName = editingActivityId.value ? 'ແກ້ໄຂ' : 'ເພີ່ມ'
  requestConfirm(
    `ຢືນຢັນການ${actionName}`,
    `ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການ${actionName}ຂໍ້ມູນກິດຈະກຳນີ້?`,
    async () => {
      saving.value = true
      try {
        let res
        if (editingActivityId.value) {
          res = await $api.post('/activity/update', {
            token: tokenRef.value,
            a_id: editingActivityId.value,
            activity_name: activityForm.value.activity_name
          })
        } else {
          res = await $api.post('/activity/insert', {
            token: tokenRef.value,
            activity_name: activityForm.value.activity_name
          })
        }

        if (res.data.status === "00") {
          showToast(editingActivityId.value ? 'ແກ້ໄຂກິດຈະກຳສຳເລັດ' : 'ເພີ່ມກິດຈະກຳສຳເລັດ')
          activityDialog.value = false
          await fetchActivities()
        } else {
          showToast(res.data.message || 'ເກີດຂໍ້ຜິດພາດ', 'error')
        }
      } catch (err) {
        console.error(err)
        showToast('ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ', 'error')
      } finally {
        saving.value = false
      }
    }
  )
}

// Delete Activity Type
const deleteActivity = async (id) => {
  requestConfirm('ຢືນຢັນການລຶບ', 'ທ່ານຕ້ອງການລົບກິດຈະກຳນີ້ແທ້ບໍ?', async () => {
    try {
      const res = await $api.post('/activity/delete', {
        token: tokenRef.value,
        a_id: id
      })
      if (res.data.status === "00") {
        showToast('ລົບກິດຈະກຳສຳເລັດ')
        await fetchActivities()
      } else {
        showToast(res.data.message || 'ບໍ່ສາມາດລົບໄດ້', 'error')
      }
    } catch (err) {
      console.error(err)
      showToast('ເກີດຂໍ້ຜິດພາດໃນການລົບ', 'error')
    }
  })
}

// BORROWER DIALOG POPUP
// Utility for uploading image
const uploadImage = async (file) => {
  if (!file) return null
  const formData = new FormData()
  formData.append('image', file)
  try {
    const res = await $api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    if (res.data.status === "00") {
      return res.data.url
    }
    return null
  } catch (err) {
    console.error("Upload failed", err)
    return null
  }
}

const borrowerImageFile = ref(null)
const borrowerImagePreview = ref(null)

const imageViewerDialog = ref(false)
const imageViewerSrc = ref('')

const openImageViewer = (src) => {
  if (src) {
    imageViewerSrc.value = src
    imageViewerDialog.value = true
  }
}

const onBorrowerImageSelected = (file) => {
  const actualFile = Array.isArray(file) ? file[0] : file
  if (actualFile) {
    borrowerImagePreview.value = URL.createObjectURL(actualFile)
  } else {
    borrowerImagePreview.value = null
  }
}

const openBorrowerDialog = (item) => {
  borrowerImageFile.value = null
  borrowerImagePreview.value = null
  if (item) {
    editingBorrowerId.value = item.b_id
    borrowerForm.value = {
      b_name: item.b_name,
      b_number: item.b_number,
      b_address: item.b_address,
      b_image: item.b_image || ''
    }
  } else {
    editingBorrowerId.value = null
    borrowerForm.value = { b_name: '', b_number: '', b_address: '', b_image: '' }
  }
  borrowerDialog.value = true
}

// Save/Edit Borrower Profile
const saveBorrower = async () => {
  const { b_name, b_number, b_address } = borrowerForm.value
  if (!b_name || !b_number || !b_address) {
    showToast('ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ', 'warning')
    return
  }
  saving.value = true
  try {
    let finalImageUrl = borrowerForm.value.b_image

    const actualFile = Array.isArray(borrowerImageFile.value) ? borrowerImageFile.value[0] : borrowerImageFile.value

    if (actualFile) {
      const uploadedUrl = await uploadImage(actualFile)
      if (uploadedUrl) {
        finalImageUrl = `${config.public.apiBase}${uploadedUrl}`
      } else {
        showToast('ອັບໂຫຼດຮູບພາບບໍ່ສຳເລັດ', 'error')
        saving.value = false
        return
      }
    }

    let res
    if (editingBorrowerId.value) {
      res = await $api.post('/borrower/update', {
        token: tokenRef.value,
        b_id: editingBorrowerId.value,
        b_name,
        b_number,
        b_address,
        b_image: finalImageUrl
      })
    } else {
      res = await $api.post('/borrower/insert', {
        token: tokenRef.value,
        b_name,
        b_number,
        b_address,
        b_image: finalImageUrl
      })
    }

    if (res.data.status === "00") {
      showToast(editingBorrowerId.value ? 'ແກ້ໄຂຜູ້ກູ້ຢືມສຳເລັດ' : 'ເພີ່ມຜູ້ກູ້ຢືມສຳເລັດ')
      borrowerDialog.value = false
      await fetchBorrowers()
    } else {
      showToast(res.data.message || 'ເກີດຂໍ້ຜິດພາດ', 'error')
    }
  } catch (err) {
    console.error(err)
    showToast('ລະບົບຂັດຂ້ອງ', 'error')
  } finally {
    saving.value = false
  }
}

// LOAN/ACCOUNTING DIALOG POPUP
const openLoanDialog = (item) => {
  if (item) {
    editingLoanId.value = item.key_id
    loanStatus.value = item.status
    
    // Format date string from database to YYYY-MM-DD for native input
    let formattedDate = ''
    if (item.borrow_date) {
      const d = new Date(item.borrow_date)
      formattedDate = d.toISOString().split('T')[0]
    }

    loanForm.value = {
      a_id: item.a_id,
      Borrower_id: item.Borrower_id || borrowers.value.find(b => b.b_name === item.borrower)?.b_id || null,
      amount: Number(item.amount),
      currency: item.currency || 'LAK',
      amount_per_kg: Number(item.amount_per_kg),
      borrow_date: formattedDate
    }
  } else {
    editingLoanId.value = null
    loanStatus.value = 'indebted'
    
    const today = new Date().toISOString().split('T')[0]
    loanForm.value = {
      a_id: activities.value[0]?.a_id || null,
      Borrower_id: borrowers.value[0]?.b_id || null,
      amount: 0,
      currency: 'LAK',
      amount_per_kg: 0,
      borrow_date: today
    }
  }
  loanDialog.value = true
}

// Save/Edit Loan/Accounting Bill
const saveLoan = async () => {
  const { a_id, Borrower_id, amount, currency, amount_per_kg, borrow_date } = loanForm.value
  if (!a_id || !Borrower_id || !amount || !currency || !amount_per_kg || !borrow_date) {
    showToast('ກະລຸນາກວດສອບ ແລະ ປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ', 'warning')
    return
  }

  const actionName = editingLoanId.value ? 'ແກ້ໄຂ' : 'ເພີ່ມ'
  requestConfirm(
    `ຢືນຢັນການ${actionName}`,
    `ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການ${actionName}ຂໍ້ມູນບິນນີ້?`,
    async () => {
      saving.value = true
      try {
        let res
        if (editingLoanId.value) {
          res = await $api.post('/accounting/update', {
            token: tokenRef.value,
            key_id: editingLoanId.value,
            a_id,
            Borrower_id,
            amount,
            currency,
            amount_per_kg,
            borrow_date
          })
        } else {
          res = await $api.post('/accounting/insert', {
            token: tokenRef.value,
            a_id,
            Borrower_id,
            amount,
            currency,
            amount_per_kg,
            borrow_date
          })
        }

        if (res.data.status === "00") {
          showToast(editingLoanId.value ? 'ອັບເດດບິນເງິນກູ້ສຳເລັດ' : 'ບັນທຶກບິນເງິນກູ້ໃໝ່ສຳເລັດ')
          loanDialog.value = false
          await Promise.all([fetchLoans(), fetchReports()])
        } else {
          showToast(res.data.message || 'ເກີດຂໍ້ຜິດພາດ', 'error')
        }
      } catch (err) {
        console.error(err)
        showToast('ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ', 'error')
      } finally {
        saving.value = false
      }
    }
  )
}

// Toggle Bill Payment Status (OK vs Indebted)
const toggleLoanStatus = (loan) => {
  const newStatus = loan.status === 'ok' ? 'indebted' : 'ok'
  const actionText = newStatus === 'ok' ? 'ຈ່າຍແລ້ວ' : 'ຄ້າງຊຳລະ'
  
  requestConfirm(
    'ຢືນຢັນການປ່ຽນສະຖານະ',
    `ທ່ານຕ້ອງການປ່ຽນສະຖານະບິນຂອງ <b>${loan.borrower}</b> ເປັນ <b class="text-indigo">${actionText}</b> ແທ້ຫຼືບໍ່?`,
    async () => {
      try {
        const res = await $api.post('/accounting/update', {
          token: tokenRef.value,
          key_id: loan.key_id,
          status: newStatus
        })
        if (res.data.status === "00") {
          showToast('ອັບເດດສະຖານະບິນສຳເລັດ')
          await Promise.all([fetchLoans(), fetchReports()])
        } else {
          showToast(res.data.message || 'ບໍ່ສາມາດປ່ຽນສະຖານະໄດ້', 'error')
        }
      } catch (err) {
        console.error(err)
        showToast('ເກີດຂໍ້ຜິດພາດໃນການປ່ຽນສະຖານະ', 'error')
      }
    }
  )
}

// 6. Running quick weight calculation API
const runQuickCalculator = async () => {
  if (calcPricePer12.value <= 0 || calcKg.value <= 0) {
    showToast('ກະລຸນາປ້ອນຕົວເລກທີ່ຫຼາຍກວ່າ 0', 'warning')
    return
  }
  calculating.value = true
  try {
    const res = await $api.post('/accounting/calculate-money', {
      pricePer12kg: Number(calcPricePer12.value),
      kg: Number(calcKg.value)
    })
    if (res.data.status === "00") {
      calcResult.value = res.data.data.totalPrice
      showToast('ຄຳນວນສຳເລັດ')
    } else {
      showToast(res.data.message || 'ຄຳນວນຜິດພາດ', 'error')
    }
  } catch (err) {
    console.error(err)
    showToast('ເກີດຂໍ້ຜິດພາດໃນການຕິດຕໍ່ເຊີເວີ', 'error')
  } finally {
    calculating.value = false
  }
}

// 7. Update profile details
const profileImageFile = ref(null)
const profileImagePreview = ref(null)
const profileFileInputRef = ref(null)

const triggerProfileUpload = () => {
  if (profileFileInputRef.value) {
    profileFileInputRef.value.click()
  }
}

const onProfileImageSelected = (event) => {
  const file = event.target.files[0]
  if (file) {
    profileImageFile.value = file
    profileImagePreview.value = URL.createObjectURL(file)
  } else {
    profileImageFile.value = null
    profileImagePreview.value = null
  }
}

const updateProfile = async () => {
  const { user_name, user_tel, user_address } = profileForm.value
  if (!user_name || !user_tel || !user_address) {
    showToast('ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບ', 'warning')
    return
  }
  requestConfirm('ຢືນຢັນການປ່ຽນແປງ', 'ທ່ານຕ້ອງການແກ້ໄຂຂໍ້ມູນໂປຣໄຟລ໌ນີ້ແທ້ບໍ່?', async () => {
    saving.value = true
    try {
      let finalImageUrl = profileForm.value.user_image

      const actualProfileFile = Array.isArray(profileImageFile.value) ? profileImageFile.value[0] : profileImageFile.value

      if (actualProfileFile) {
        const uploadedUrl = await uploadImage(actualProfileFile)
        if (uploadedUrl) {
          finalImageUrl = `${config.public.apiBase}${uploadedUrl}`
        } else {
          showToast('ອັບໂຫຼດຮູບພາບບໍ່ສຳເລັດ', 'error')
          saving.value = false
          return
        }
      }

      const res = await $api.post('/auth/updateUser', {
        token: tokenRef.value,
        user_name,
        user_tel,
        user_address,
        user_image: finalImageUrl
      })
      if (res.data.status === "00") {
        showToast('ອັບເດດໂປຣໄຟລ໌ສຳເລັດ')
        localStorage.setItem('user_name', user_name)
        await fetchProfile()
        
        // Sync profileForm with the new updated user data
        if (user.value) {
          profileForm.value = {
            user_name: user.value.user_name || '',
            user_tel: user.value.user_tel || '',
            user_address: user.value.user_address || '',
            user_image: user.value.user_image || ''
          }
        }

        profileImageFile.value = null
        profileImagePreview.value = null
      } else {
        showToast(res.data.message || 'ບໍ່ສາມາດອັບເດດໄດ້', 'error')
      }
    } catch (err) {
      console.error(err)
      showToast('ເກີດຂໍ້ຜິດພາດໃນການຕິດຕໍ່ເຊີເວີ', 'error')
    } finally {
      saving.value = false
    }
  })
}

// 8. Update password
const updatePassword = async () => {
  const { oldPassword, newPassword, confirmPassword } = passwordForm.value
  if (!oldPassword || !newPassword || !confirmPassword) {
    showToast('ກະລຸນາປ້ອນຂໍ້ມູນລະຫັດຜ່ານໃຫ້ຄົບ', 'warning')
    return
  }
  if (newPassword !== confirmPassword) {
    showToast('ລະຫັດຜ່ານໃໝ່ ແລະ ຢືນຢັນລະຫັດຜ່ານບໍ່ກົງກັນ', 'error')
    return
  }
  requestConfirm('ຢືນຢັນການປ່ຽນລະຫັດຜ່ານ', 'ທ່ານຕ້ອງການປ່ຽນລະຫັດຜ່ານໃໝ່ແທ້ບໍ່?', async () => {
    saving.value = true
    try {
      const res = await $api.put('/auth/updatePassword', {
        token: tokenRef.value,
        oldPassword,
        newPassword
      })
      if (res.data.status === "00") {
        showToast('ປ່ຽນລະຫັດຜ່ານສຳເລັດແລ້ວ')
        passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
      } else {
        showToast(res.data.message || 'ປ່ຽນລະຫັດຜ່ານຜິດພາດ', 'error')
      }
    } catch (err) {
      console.error(err)
      showToast('ເກີດຂໍ້ຜິດພາດ', 'error')
    } finally {
      saving.value = false
    }
  })
}

// 9. Reset password by user ID (admin function)
const handleResetPasswordById = async () => {
  const { user_id, newPassword, confirmPassword } = resetPasswordForm.value
  if (!user_id || !newPassword || !confirmPassword) {
    showToast('ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບ', 'warning')
    return
  }
  if (newPassword !== confirmPassword) {
    showToast('ລະຫັດຜ່ານໃໝ່ ແລະ ຢືນຢັນລະຫັດຜ່ານບໍ່ກົງກັນ', 'error')
    return
  }
  requestConfirm('ຢືນຢັນການຣີເຊັດ', `ທ່ານຕ້ອງການຣີເຊັດລະຫັດຜ່ານຂອງ ID: ${user_id} ແທ້ບໍ່?`, async () => {
    saving.value = true
    try {
      const res = await $api.post('/auth/resetPasswordById', {
        user_id: Number(user_id),
        newPassword
      })
      if (res.data.status === '00') {
        showToast('ຣີເຊັດລະຫັດຜ່ານສຳເລັດ')
        resetPasswordForm.value = { user_id: '', newPassword: '', confirmPassword: '' }
      } else {
        showToast(res.data.message || 'ຣີເຊັດລະຫັດຜ່ານຜິດພາດ', 'error')
      }
    } catch (err) {
      console.error(err)
      showToast('ເກີດຂໍ້ຜິດພາດໃນການຕິດຕໍ່ເຊີເວີ', 'error')
    } finally {
      saving.value = false
    }
  })
}

// ----------------- ADMIN USER MANAGEMENT -----------------

// Fetch all users (admin only)
const fetchAllUsers = async () => {
  loadingUsers.value = true
  try {
    const res = await $api.post('/auth/admin/getAllUsers', { token: tokenRef.value })
    if (res.data.status === '00') {
      allUsers.value = res.data.data
    } else {
      showToast(res.data.message || 'ດຶງລາຍຊື່ຜູ້ໃຊ້ຜິດພາດ', 'error')
    }
  } catch (err) {
    console.error(err)
    showToast('ເກີດຂໍ້ຜິດພາດໃນການຕິດຕໍ່ເຊີເວີ', 'error')
  } finally {
    loadingUsers.value = false
  }
}

// Confirm and delete a user
const confirmDeleteUser = async (targetUser) => {
  requestConfirm('ຢືນຢັນການລຶບ', `ທ່ານຕ້ອງການລົບຜູ້ໃຊ້ "${targetUser.user_name}" ແທ້ບໍ?<br>ການດຳເນີນການນີ້ ຈະຖືກຍົກເລີກ ບໍ່ໄດ້!`, async () => {
    // Optimistic loading
    const idx = allUsers.value.findIndex(u => u.user_id === targetUser.user_id)
    if (idx !== -1) allUsers.value[idx]._loadingDelete = true
    try {
      const res = await $api.post('/auth/admin/deleteUser', {
        token: tokenRef.value,
        user_id: targetUser.user_id
      })
      if (res.data.status === '00') {
        showToast(`ລົບຜູ້ໃຊ້ "${targetUser.user_name}" ສຳເລັດ`)
        await fetchAllUsers()
      } else {
        showToast(res.data.message || 'ລົບຜູ້ໃຊ້ຜິດພາດ', 'error')
        if (idx !== -1) allUsers.value[idx]._loadingDelete = false
      }
    } catch (err) {
      console.error(err)
      showToast('ເກີດຂໍ້ຜິດພາດໃນການລົບ', 'error')
      if (idx !== -1) allUsers.value[idx]._loadingDelete = false
    }
  })
}

// Toggle user role between admin <-> user
const toggleUserRole = async (targetUser) => {
  const newRole = targetUser.role === 'admin' ? 'user' : 'admin'
  const label = newRole === 'admin' ? 'Admin' : 'User'
  requestConfirm('ປ່ຽນສິດທິຜູ້ໃຊ້', `ປ່ຽນສິດທິຂອງ "${targetUser.user_name}" ເປັນ ${label} ແທ້ບໍ?`, async () => {
    const idx = allUsers.value.findIndex(u => u.user_id === targetUser.user_id)
    if (idx !== -1) allUsers.value[idx]._loadingRole = true
    try {
      const res = await $api.post('/auth/admin/updateUserRole', {
        token: tokenRef.value,
        user_id: targetUser.user_id,
        role: newRole
      })
      if (res.data.status === '00') {
        showToast(`ປ່ຽນ "${targetUser.user_name}" ເປັນ ${label} ສຳເລັດ`)
        await fetchAllUsers()
      } else {
        showToast(res.data.message || 'ປ່ຽນ Role ຜິດພາດ', 'error')
        if (idx !== -1) allUsers.value[idx]._loadingRole = false
      }
    } catch (err) {
      console.error(err)
      showToast('ເກີດຂໍ້ຜິດພາດ', 'error')
      if (idx !== -1) allUsers.value[idx]._loadingRole = false
    }
  })
}

// Open reset password dialog for a specific user
const openAdminResetDialog = (targetUser) => {
  adminResetTarget.value = targetUser
  adminResetNewPassword.value = ''
  adminResetConfirmPassword.value = ''
  adminResetDialog.value = true
}

// Submit admin reset password
const submitAdminReset = async () => {
  if (!adminResetNewPassword.value || adminResetNewPassword.value.length < 6) {
    showToast('ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ', 'warning')
    return
  }
  if (adminResetNewPassword.value !== adminResetConfirmPassword.value) {
    showToast('ລະຫັດຜ່ານບໍ່ກົງກັນ', 'error')
    return
  }
  requestConfirm('ຢືນຢັນການຣີເຊັດ', `ທ່ານຕ້ອງການຣີເຊັດລະຫັດຜ່ານຂອງຜູ້ໃຊ້ "${adminResetTarget.value.user_name}" ແທ້ບໍ່?`, async () => {
    saving.value = true
    try {
      const res = await $api.post('/auth/resetPasswordById', {
        token: tokenRef.value,
        user_id: adminResetTarget.value.user_id,
        newPassword: adminResetNewPassword.value
      })
      if (res.data.status === '00') {
        showToast(`ຣີເຊັດລະຫັດຜ່ານຂອງ "${adminResetTarget.value.user_name}" ສຳເລັດ`)
        adminResetDialog.value = false
      } else {
        showToast(res.data.message || 'ຣີເຊັດລະຫັດຜ່ານຜິດພາດ', 'error')
      }
    } catch (err) {
      console.error(err)
      showToast('ເກີດຂໍ້ຜິດພາດໃນການຕິດຕໍ່ເຊີເວີ', 'error')
    } finally {
      saving.value = false
    }
  })
}

// Logout
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user_name')
  showToast('ອອກຈາກລະບົບສຳເລັດ', 'success')
  router.push('/')
}

// ----------------- UTILITY FORMATTERS -----------------
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('lo-LA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDateOnly = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('lo-LA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatNumber = (num) => {
  if (num === undefined || num === null) return '0'
  return Number(num).toLocaleString()
}
</script>

<style scoped>
/* Scoped Styling for custom dashboard assets */

/* Slide Cards Styling */
.modern-dash-card {
  border-radius: 20px !important;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 140px;
  border: none !important;
}

.modern-dash-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.22) !important;
}

.card-inner {
  padding: 16px;
  height: 100%;
}

.glass-holder {
  background: rgba(255, 255, 255, 0.24);
  backdrop-filter: blur(8px);
  padding: 10px;
  border-radius: 14px;
  display: flex;
}

/* Slide Gradients */
.color-bg-0 {
  background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
}

.color-bg-1 {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.color-bg-2 {
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
}

.color-bg-3 {
  background: linear-gradient(135deg, #f59e0b 0%, #e11d48 100%);
}

.opacity-85 {
  opacity: 0.85;
}

.bg-black-opacity-20 {
  background: rgba(0, 0, 0, 0.15);
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.decor-svg {
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1));
}

.cursor-pointer {
  cursor: pointer;
}

/* ===================== PREMIUM APP BAR ===================== */
/* Chart Cards */
.chart-card {
  background: white;
  overflow: hidden;
}
.chart-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f1f5f9;
}
.chart-card-title {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}
.chart-card-sub {
  font-size: 12px;
  color: #94a3b8;
}
.chart-body {
  padding: 20px 24px 24px;
}

/* KPI Cards */
.report-kpi-card {
  border-radius: 18px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.report-kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.12) !important;
}
.report-kpi-card::after {
  content: '';
  position: absolute;
  right: -20px; top: -20px;
  width: 100px; height: 100px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
}
.kpi-blue {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  box-shadow: 0 6px 20px rgba(99,102,241,0.3);
}
/* old kpi classes kept for compat */
.kpi-green { background: linear-gradient(135deg,#10b981,#059669); }
.kpi-orange { background: linear-gradient(135deg,#f97316,#ea580c); }
.kpi-icon { width:44px;height:44px;background:rgba(255,255,255,.2);border-radius:12px;display:flex;align-items:center;justify-content:center; }
.kpi-value { font-size:28px;font-weight:800;color:white;line-height:1; }
.kpi-label { font-size:13px;color:rgba(255,255,255,.75);font-weight:500; }

/* ======== NEW RESPONSIVE REPORT STYLES ======== */

/* Page header */
.report-page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.rph-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(99,102,241,0.1);
  color: #4338ca;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 100px;
  border: 1px solid rgba(99,102,241,0.2);
  margin-bottom: 8px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.rph-title {
  font-size: 22px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.2;
  margin-bottom: 4px;
}
.rph-sub { font-size: 13px; color: #94a3b8; }

/* Empty state */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}
.empty-state-icon { font-size: 56px; margin-bottom: 16px; }
.empty-state-title { font-size: 18px; font-weight: 700; color: #64748b; margin-bottom: 6px; }
.empty-state-sub { font-size: 13px; color: #94a3b8; }

/* KPI Strip */
.kpi-strip {
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
  overflow: hidden;
  min-height: 80px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.kpi-strip:hover { transform: translateY(-3px); }
.kpi-indigo { background: linear-gradient(135deg,#6366f1,#4338ca); box-shadow: 0 4px 16px rgba(99,102,241,0.25); }
.kpi-emerald { background: linear-gradient(135deg,#10b981,#059669); box-shadow: 0 4px 16px rgba(16,185,129,0.25); }
.kpi-amber { background: linear-gradient(135deg,#f59e0b,#d97706); box-shadow: 0 4px 16px rgba(245,158,11,0.25); }
.kpi-strip-icon {
  width: 42px; height: 42px; flex-shrink: 0;
  background: rgba(255,255,255,0.18);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
}
.kpi-strip-body { flex: 1; min-width: 0; }
.kpi-strip-val { font-size: 26px; font-weight: 800; color: white; line-height: 1; }
.kpi-strip-lbl { font-size: 12px; color: rgba(255,255,255,0.75); margin-top: 3px; }
.kpi-strip-decor {
  font-size: 28px; opacity: 0.3;
  position: absolute; right: 16px; top: 50%;
  transform: translateY(-50%);
}

/* Glass Chart Card */
.chart-glass-card {
  background: white;
  border-radius: 18px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  overflow: hidden;
  transition: box-shadow 0.25s ease;
}
.chart-glass-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.1); }
.cgc-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #f8fafc;
}
.cgc-icon-wrap {
  width: 34px; height: 34px; flex-shrink: 0;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
}
.cgc-purple { background: linear-gradient(135deg,#8b5cf6,#6366f1); }
.cgc-teal { background: linear-gradient(135deg,#06b6d4,#0891b2); }
.cgc-violet { background: linear-gradient(135deg,#a855f7,#7c3aed); }
.cgc-slate { background: linear-gradient(135deg,#64748b,#475569); }
.cgc-title { font-size: 14px; font-weight: 700; color: #1e293b; }
.cgc-sub { font-size: 11px; color: #94a3b8; margin-top: 2px; display: flex; align-items: center; gap: 6px; }
.dot-green { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10b981; }
.dot-orange { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #f97316; }
.cgc-body { padding: 16px 20px 20px; position: relative; }
.cgc-donut-body {
  display: flex; align-items: center; justify-content: center;
  min-height: 240px; padding: 16px;
}

/* Detail table */
.detail-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-right: 8px;
  gap: 8px;
}
.table-scroll-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 8px;
}
.detail-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.detail-table thead tr {
  background: #f8fafc;
}
.detail-table th {
  padding: 10px 14px;
  font-weight: 700;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}
.detail-table td {
  padding: 10px 14px;
  color: #374151;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
}
.detail-table tbody tr:hover { background: #fafafa; }
.detail-table .text-right { text-align: right; }
.detail-table .text-center { text-align: center; }
.text-indigo { color: #4338ca !important; }

.badge-ok {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
  background: rgba(16,185,129,0.12);
  color: #059669;
  border: 1px solid rgba(16,185,129,0.25);
}
.badge-pending {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
  background: rgba(249,115,22,0.12);
  color: #ea580c;
  border: 1px solid rgba(249,115,22,0.25);
}

/* Nav tabs */
.sticky-tabs {
  position: sticky;
  top: 64px; /* for desktop */
  z-index: 99;
}
@media (max-width: 600px) {
  .sticky-tabs {
    top: 68px; /* 56px app-bar + 12px gap */
  }
}
.nav-tabs-wrapper {
  background: white;
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(49, 46, 129, 0.08);
  border: 1px solid rgba(49, 46, 129, 0.15);
  border-bottom: 4px solid #283593; /* indigo-darken-3 */
  overflow: hidden;
}
.nav-tabs-bar { border-radius: 14px !important; }
.nav-tab {
  font-weight: 600 !important;
  min-width: 50px !important;
  font-size: 13px !important;
}

/* -------------------------------------------------------- */
/* RESPONSIVE BORROWERS & LOANS TABS */
/* -------------------------------------------------------- */

/* Section Headers */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.section-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.section-icon {
  width: 38px; height: 38px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
.section-title {
  font-size: 18px; font-weight: 800; color: #1e293b;
}
.section-sub {
  font-size: 13px; color: #64748b; font-weight: 500;
}

/* Filter Pills */
.filter-pill-group {
  display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px;
}
.filter-pill {
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 13px; font-weight: 600;
  color: #64748b; background: white;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
  white-space: nowrap;
}
.filter-pill-active {
  background: #4f46e5; color: white; border-color: #4f46e5;
  box-shadow: 0 2px 8px rgba(79,70,229,0.3);
}

/* Mobile Cards */
.borrower-card, .loan-card {
  background: white;
  border-radius: 14px;
  padding: 16px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.bc-left {
  display: flex; align-items: flex-start; gap: 12px; flex: 1;
}
.bc-avatar, .lc-avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: #eef2ff; color: #4f46e5;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 16px;
}
.bc-name { font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
.bc-phone, .bc-address { font-size: 13px; color: #64748b; display: flex; align-items: center; margin-bottom: 2px; }

.lc-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
.lc-borrower { display: flex; align-items: center; gap: 10px; }
.lc-name { font-size: 14px; font-weight: 700; color: #1e293b; }
.lc-date { font-size: 12px; color: #94a3b8; display: flex; align-items: center; margin-top: 2px;}
.lc-actions { display: flex; align-items: center; gap: 8px; }
.lc-body { background: #f8fafc; border-radius: 10px; padding: 12px; }
.lc-stats { display: flex; justify-content: space-between; }
.lc-stat { text-align: center; flex: 1; }
.lc-stat-divider { width: 1px; background: #e2e8f0; }
.lc-stat-label { font-size: 11px; color: #64748b; margin-bottom: 2px; text-transform: uppercase; }
.lc-stat-value { font-size: 14px; font-weight: 700; color: #334155; }
.lc-unit { font-size: 10px; font-weight: 500; }

.status-badge-ok {
  background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 700;
}
.status-badge-pending {
  background: #ffedd5; color: #9a3412; padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 700;
}

/* Desktop Data Tables */
.data-table-card {
  background: white; border-radius: 14px; overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}
.data-table {
  width: 100%; border-collapse: collapse; font-size: 13px;
}
.data-table th {
  background: #f8fafc; padding: 12px 16px; text-align: left;
  font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;
  border-bottom: 1px solid #e2e8f0;
}
.data-table td {
  padding: 12px 16px; border-bottom: 1px solid #f1f5f9; color: #334155;
}
.data-table tbody tr:hover { background: #f8fafc; }
.mini-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  background: #eef2ff; color: #4f46e5;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700;
}
.mini-avatar.purple { background: #f3e8ff; color: #7e22ce; }

/* Calculator Widget */
.calc-card {
  background: white; border-radius: 14px; border-left: 4px solid #14b8a6;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;
}
.calc-header { padding: 16px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; }
.calc-body { padding: 16px; }
.calc-label { font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 6px; }
.calc-result {
  margin-top: 16px; padding: 16px; background: #f0fdfa; border-radius: 10px; text-align: center;
}
.calc-result-label { font-size: 12px; font-weight: 600; color: #115e59; }
.calc-result-value { font-size: 24px; font-weight: 800; color: #0d9488; margin: 4px 0; }
.calc-result-sub { font-size: 11px; color: #0f766e; }

/* Responsive adjustments */
@media (max-width: 600px) {
  .rph-title { font-size: 18px; }
  .kpi-strip-val { font-size: 22px; }
  .cgc-header { padding: 12px 16px; }
  .cgc-body { padding: 12px 14px 16px; }
  .chart-glass-card { border-radius: 14px; }
}
</style>

<style>
/* -------------------------------------------------------------------------- */
/* GLOBAL DESIGN UPGRADES & OVERRIDES FOR PREMIUM LAO STYLING                */
/* -------------------------------------------------------------------------- */

/* 1. Global Font Family Override */
.app-container,
.app-container * {
  font-family: 'Noto Sans Lao', 'Phetsarath OT', 'Noto Sans', sans-serif !important;
}

/* Main background */
.main-bg { background: #f4f6fb !important; }

/* Responsive container */
.page-container {
  padding: 16px 12px !important;
  max-width: 1280px !important;
}
@media (min-width: 600px) {
  .page-container { padding: 20px 16px !important; }
}
@media (min-width: 960px) {
  .page-container { padding: 28px 24px !important; }
}

/* Premium App Bar */
.premium-app-bar {
  background: linear-gradient(90deg, #1e1b4b 0%, #312e81 50%, #4338ca 85%, #06b6d4 100%) !important;
  border-bottom: 1px solid rgba(255,255,255,0.08) !important;
}
.app-logo {
  width: 34px; height: 34px;
  background: rgba(255,255,255,0.15);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(8px);
}
.app-title-text {
  font-size: 16px !important;
  font-weight: 700;
  color: white;
  letter-spacing: 0.3px;
}
.user-pill {
  background: rgba(255,255,255,0.1);
  border-radius: 100px;
  border: 1px solid rgba(255,255,255,0.15);
  backdrop-filter: blur(8px);
}
.logout-btn {
  border-radius: 10px !important;
  border: 1px solid rgba(255,255,255,0.2) !important;
}

/* 2. Welcome Banner Gradient Card */
.welcome-banner {
  background: linear-gradient(135deg, #1e1b4b 0%, #5c6bc0 50%, #4338ca 100%) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.max-w-text {
  max-width: 650px;
}

.decor-circle-1 {
  position: absolute;
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0) 70%);
  top: -100px;
  right: -50px;
  pointer-events: none;
}

.decor-circle-2 {
  position: absolute;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, rgba(6, 182, 212, 0) 70%);
  bottom: -60px;
  right: 120px;
  pointer-events: none;
}

.z-index-1 {
  position: relative;
  z-index: 1;
}

.z-index-0 {
  position: absolute;
  z-index: 0;
}

/* 3. Stat Cards with Custom Accent Left border */
.stat-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  border-radius: 16px !important;
  border-top: 1px solid #f1f5f9 !important;
  border-right: 1px solid #f1f5f9 !important;
  border-bottom: 1px solid #e2e8f0 !important;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08) !important;
}

.stat-icon-wrapper {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
}

/* Accent colors */
.bg-teal-lighten-5 {
  background-color: #f0fdf4 !important;
}
.bg-deep-orange-lighten-5 {
  background-color: #fff7ed !important;
}
.text-teal-darken-2 {
  color: #15803d !important;
}
.text-deep-orange-darken-2 {
  color: #c2410c !important;
}

/* 4. Segmented Control / Pill Navigation Tabs */
.pill-tabs {
  background-color: #e2e8f0 !important;
  padding: 6px !important;
  border-radius: 100px !important;
  max-width: fit-content;
  margin: 0 auto;
}

.pill-tabs .v-tab {
  text-transform: none !important;
  letter-spacing: 0px !important;
  color: #475569 !important;
  transition: all 0.25s ease !important;
  min-height: 40px !important;
  height: 40px !important;
}

.pill-tabs .v-tab--selected {
  background-color: #ffffff !important;
  color: #312e81 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
}

.pill-tabs .v-tab__slider {
  display: none !important; /* Hide default line slider */
}

/* 5. Modern Data Tables */
.modern-table {
  border-radius: 0px !important;
  background: white !important;
}

.modern-table th {
  color: #334155 !important;
  font-size: 14px !important;
  letter-spacing: 0.2px;
}

.table-row {
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: #f8fafc !important;
}

.action-btn {
  transition: transform 0.2s ease;
}

.action-btn:hover {
  transform: scale(1.15);
}

.bg-slate-100 {
  background-color: #f1f5f9 !important;
}

.bg-slate-50 {
  background-color: #f8fafc !important;
}

/* Dot Indicator for Status chips */
.dot-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
}

.bg-teal {
  background-color: #0f766e !important;
}

.bg-rose {
  background-color: #be123c !important;
}

.border-teal-lighten-2 {
  border-color: #99f6e4 !important;
}

.border-rose-lighten-2 {
  border-color: #fecdd3 !important;
}

/* Gradient Calculator Header */
.bg-gradient-indigo {
  background: linear-gradient(135deg, #312e81 0%, #4338ca 100%) !important;
}

/* Dialog Stylings */
.rounded-20 {
  border-radius: 24px !important;
}

.shadow-xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.35s ease-out forwards;
}

.fade-in-window {
  animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* Expandable panel styles */
.modern-panels .v-expansion-panel {
  border-radius: 12px !important;
  border: 1px solid #e2e8f0 !important;
}

.modern-panels .v-expansion-panel-title {
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
}

.modern-panels .v-expansion-panel-title--active {
  border-bottom: 1px solid #e2e8f0;
}

.hover-bg-slate-100:hover {
  background-color: #f1f5f9 !important;
}

.bg-white-hover:hover {
  background-color: #f8fafc !important;
}

/* Responsive enhancements for dashboard */
.responsive-heading { font-size: 22px; }
.activity-slide-card { width: 280px; min-height: 180px; }
@media (max-width: 600px) {
  .app-title-text {
    font-size: 13px !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 135px;
  }
  .responsive-heading { font-size: 16px !important; }
  .responsive-heading .v-icon { font-size: 18px !important; }
  .summary-card { padding: 4px !important; border-width: 0 0 0 4px !important; }
  .responsive-icon { font-size: 18px !important; }
  .responsive-chip { font-size: 9px !important; height: 18px !important; padding: 0 6px !important; }
  .responsive-label { font-size: 11px !important; white-space: normal; line-height: 1.2 !important; }
  .responsive-value { font-size: 14px !important; }
  .responsive-value span { font-size: 10px !important; }
  .stat-icon-wrapper { width: 32px !important; height: 32px !important; min-width: 32px !important; }
  
  /* Top 3 summary cards adjustments */
  .summary-top-card { margin-bottom: 4px !important; }
  .summary-top-card .text-subtitle-2 { font-size: 12px !important; }
  
  /* Activity cards adjustments */
  .activity-slide-card { width: 160px !important; min-height: 105px !important; }
  .activity-slide-card .card-inner { padding: 10px !important; }
  .activity-slide-card .text-truncate { font-size: 13px !important; white-space: normal !important; line-height: 1.2 !important; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; text-overflow: ellipsis; }
  .activity-slide-card .glass-holder { width: 24px !important; height: 24px !important; border-radius: 6px !important; }
  .activity-slide-card .text-caption { font-size: 9px !important; }
  .activity-slide-card .v-btn { width: 24px !important; height: 24px !important; }
  .activity-slide-card .v-btn .v-icon { font-size: 14px !important; }
  .activity-slide-card .decor-svg { width: 25px !important; height: 7px !important; }

  /* KPI Strips adjustments */
  .kpi-strip {
    flex-direction: column !important;
    padding: 8px 4px !important;
    gap: 4px !important;
    min-height: 80px !important;
    text-align: center !important;
    border-radius: 12px !important;
  }
  .kpi-strip-icon {
    width: 24px !important;
    height: 24px !important;
    border-radius: 6px !important;
  }
  .kpi-strip-icon .v-icon {
    font-size: 14px !important;
  }
  .kpi-strip-val { font-size: 14px !important; font-weight: 700 !important; }
  .kpi-strip-lbl { font-size: 10px !important; line-height: 1.1 !important; margin-top: 0 !important; }
  .kpi-strip-decor { display: none !important; }
}
/* Mobile Charts Scroll */
@media (max-width: 959px) {
  .charts-mobile-scroll {
    flex-wrap: nowrap !important;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 8px;
  }
  .chart-slide-item {
    scroll-snap-align: center;
    flex: 0 0 auto !important;
  }
  .charts-mobile-scroll::-webkit-scrollbar {
    height: 4px;
  }
  .charts-mobile-scroll::-webkit-scrollbar-thumb {
    background: #e0e0e0;
    border-radius: 4px;
  }
}
</style>