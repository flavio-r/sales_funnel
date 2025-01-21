import { cotacao } from "./tabs/cotacoes";
import { ActionButtons } from "./actionButtons";
import { useState } from "react";
import { Modal, Box, Typography } from '@mui/material';
import { useContext } from "react";
import { AuthContext } from "../context/authProvider";
import Swal from 'sweetalert2';

import toast from "react-hot-toast";
export function Cotacao({ index, cotacao }: { index: number, cotacao: cotacao }) {
  const { user } = useContext(AuthContext);
  
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handleOpen = (content: string) => {
    setModalContent(content);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const baseUrlProposta = `https://proposta.copapel.com.br`;

  const BRL = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  function getStatus(DocStatus: string) {
    const DocumentStatus =
      DocStatus === 'O' ? 'Aberto' :
        DocStatus === 'C' ? 'Fechado' :
          DocStatus === 'W' ? 'Pendente' :
            DocStatus === 'virou_pedido' ? 'Virou pedido' : 'Desconhecido'

    return DocumentStatus
  }
  async function visualizarPDF(DocEntry: string) {
    try {
      window.open(`${baseUrlProposta}/api/sap/getPDF/${DocEntry}`, '_blank');
    } catch (error) {
      toast.error('❌ Erro ao visualizar PDF:' + JSON.stringify(error));
    }
  }
  async function duplicarProposta(DocEntry: string) {
    try {
      const url = `${baseUrlProposta}/api/proposta/createFromSAP/${DocEntry}`;

      const response = await fetch(url);


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const { success, proposta } = data;

      if (!success) {
        throw new Error('Erro ao duplicar Proposta!');
      }

      const { redirectUrl } = proposta;

      // Set cookie if needed
      if (!redirectUrl) {
        throw new Error('Erro ao duplicar Proposta!');
      }

      window.open(redirectUrl, '_blank');

    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao duplicar Proposta!');
    }
  }
  async function visualizarDadosSAP(DocEntry: string) {
    //closeAllTippyMenus();
    try {
      //const docNum = DocNum;
      const response = await fetch(`${baseUrlProposta}/api/sap/getQuotationDetails/${DocEntry}`, { method: "get" });
      let data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erro ao buscar dados da cotação');
      }
      data = data["0"];

      const { DocumentLines: items } = data;

      let quotation = data;
      const modalContent = `
            <div class="flex flex-col w-full bg-gray-100 max-h-[90vh]">
              <div class="flex justify-between items-center p-4 bg-white border-b sticky top-0 z-10">
                <h3 class="text-xl font-bold flex items-center gap-2">
                    📄 Detalhes da Cotação #${quotation.DocNum}
                </h3>
                <button type="button" class="p-2 hover:bg-gray-100 rounded-full transition-colors" onClick="closeModal()">
                    ✕
                </button>
            </div>
          
             <div class="p-6 space-y-6 overflow-y-auto">
                <div class="flex flex-wrap gap-6">
                  <div class="flex-1 min-w-[300px]">
                    <div class="bg-white p-4 rounded-lg shadow-sm">
                      <h3 class="text-lg font-semibold border-b pb-2 mb-4 text-blue-600 flex items-center gap-2">
                        👤 Informações do Cliente
                      </h3>
                      <div class="space-y-2">
                        <p class="flex items-center gap-2">🆔 <span class="font-semibold">Código:</span> ${quotation.CardCode}</p>
                        <p class="flex items-center gap-2">🏢 <span class="font-semibold">Nome:</span> ${quotation.CardName}</p>
                        <p class="flex items-center gap-2">✉️ <span class="font-semibold">Email:</span> ${quotation.E_Mail || 'Não informado'}</p>
                        <p class="flex items-center gap-2">📞 <span class="font-semibold">Telefone:</span> ${quotation.Phone1 || 'Não informado'}</p>
                        <p class="flex items-center gap-2">👔 <span class="font-semibold">Contato:</span> ${quotation.CntctPrsn || 'Não informado'}</p>
                      </div>
                    </div>
                  </div>
          
                  <div class="flex-1 min-w-[300px]">
                    <div class="bg-white p-4 rounded-lg shadow-sm">
                      <h3 class="text-lg font-semibold border-b pb-2 mb-4 text-blue-600 flex items-center gap-2">
                        ℹ️ Informações da Cotação
                      </h3>
                      <div class="space-y-2">
                        <p class="flex items-center gap-2">📅 <span class="font-semibold">Data de Criação:</span> ${new Date(quotation.DocDate).toLocaleDateString()}</p>
                        <p class="flex items-center gap-2">📅 <span class="font-semibold">Data de Validade:</span> ${new Date(quotation.DocDueDate).toLocaleDateString()}</p>
                        <p class="flex items-center gap-2">📈 <span class="font-semibold">Status:</span> ${quotation.DocumentStatus === 'O' ? 'Aberto' :
          quotation.DocumentStatus === 'C' ? 'Fechado' :
            quotation.DocumentStatus === 'W' ? 'Virou Pedido' : 'Em Análise'}</p>
                        <p class="flex items-center gap-2">🏢 <span class="font-semibold">Unidade:</span> ${quotation.BPLName}</p>
                        <p class="flex items-center gap-2">💵 <span class="font-semibold">Valor Total:</span> R$ ${parseFloat(quotation.DocTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                  </div>
                </div>
          
                <div class="bg-white p-4 rounded-lg shadow-sm">
                  <h3 class="text-lg font-semibold border-b pb-2 mb-4 flex items-center gap-2">
                    📝 Itens da Cotação
                  </h3>
                  <div class="overflow-x-auto">
                    <table class="w-full">
                      <thead class="bg-gray-50">
                        <tr>
                          <th class="px-4 py-2 text-left">Imagem</th>
                          <th class="px-4 py-2 text-left">Código</th>
                          <th class="px-4 py-2 text-left">Descrição</th>
                          <th class="px-4 py-2 text-left">Quantidade</th>
                          <th class="px-4 py-2 text-left">Valor Unitário</th>
                          <th class="px-4 py-2 text-left">Total</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y">
                        ${items.map((item: any) => `
                          <tr class="hover:bg-gray-50">
                            <td class="px-4 py-2">
                              <img 
                                src="https://click.copapel.com.br/images/produtos/${item.ItemCode}.jpg" 
                                alt="Imagem não encontrada"
                                onerror="this.onerror=null; this.src='../assets/landscape-placeholder-svgrepo-com.svg';"
                                class="w-14 h-14 object-contain"
                              />
                            </td>
                            <td class="px-4 py-2">${item.ItemCode}</td>
                            <td class="px-4 py-2">${item.Dscription}</td>
                            <td class="px-4 py-2">${item.Quantity}</td>
                            <td class="px-4 py-2">R$ ${parseFloat(item.Price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td class="px-4 py-2">R$ ${(item.Quantity * item.Price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          `;

      // Criar ou atualizar o modal
      /*
      let modalElement = document.getElementById('visualizarDadosModal');
      if (!modalElement) {
          modalElement = document.createElement('div');
          modalElement.id = 'visualizarDadosModal';
          modalElement.className = 'modal fade';
          modalElement.setAttribute('tabindex', '-1');
          modalElement.innerHTML = `<div class="modal-dialog modal-xl"><div class="modal-content">${modalContent}</div></div>`;
          document.body.appendChild(modalElement);
      } else {
          modalElement.querySelector('.modal-content').innerHTML = modalContent;
      }
          */

      // Mostrar o modal

      handleOpen(modalContent)
    } catch (error) {
      console.error('Erro ao visualizar dados:', error);
      toast.error('Não foi possível carregar os dados da cotação');
    }
  }
  async function atualizarValidade(docEntry: string, docNum: string) {
    try {
      const { value: dias } = await Swal.fire({
        title: 'Atualizar Validade',
        html: ` 
                <style>
                .input-validade {
                padding: 10px 12px;
                font-size: 14px;
                width: 90%;
                color: #2c3e50;
                background-color: #f8fafc;
                border: 2px solid rgba(79, 146, 145, 0.2);
                border-radius: 6px;
                transition: all 0.2s ease;
                outline: none;
                box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
              }

              .input-validade:hover {
                border-color: rgba(79, 146, 145, 0.4);
                background-color: #ffffff;
              }

              .input-validade:focus {
                border-color: #4f9291;
                background-color: #ffffff;
                box-shadow: 0 0 0 3px rgba(79, 146, 145, 0.1);
              }

              .input-validade::-webkit-inner-spin-button {
                opacity: 1;
                height: 28px;
              }

              .form-label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: #374151;
              }

              .text-muted {
                color: #6b7280;
                font-size: 12px;
                margin-top: 4px;
              }

              .text-danger {
                color: #dc2626;
                font-size: 12px;
                margin-top: 4px;
              }
                </style>
                <div class="form-group">
                  <label for="diasValidade" class="form-label">Novo prazo de validade (em dias):</label>
                  <input type="number" id="diasValidade" class="input-validade" min="1" value="30">
                  <small class="text-muted mt-2" id="previewData"></small>
                  <div id="validationMessage" class="text-danger mt-2" style="display: none;">
                      O prazo não pode ser superior a 60 dias
                  </div>
                </div>
              `,
        didOpen: () => {
          const input = document.getElementById('diasValidade');
          const preview = document.getElementById('previewData');
          const validationMessage = document.getElementById('validationMessage');

          const atualizarPreview = () => {
            const dias = parseInt((input as HTMLInputElement).value) || 0;
            const novaData = new Date();
            novaData.setDate(novaData.getDate() + dias);
            preview!.textContent = `Nova data de validade: ${novaData.toLocaleDateString('pt-BR')}`;

            // Validação dos 60 dias
            if (dias > 60) {
              preview!.style.color = '#dc3545';
              validationMessage!.style.display = 'block';
            } else {
              preview!.style.color = '';
              validationMessage!.style.display = 'none';
            }
          };

          input!.addEventListener('input', atualizarPreview);
          atualizarPreview();
        },
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#4f9291',
        cancelButtonColor: '#d33',
        preConfirm: () => {
          const dias = parseInt((document.getElementById('diasValidade') as HTMLInputElement).value);
          if (!dias || dias < 1) {
            Swal.showValidationMessage('Por favor, insira um número válido de dias');
            return false;
          }
          if (dias > 60) {
            Swal.showValidationMessage('O prazo não pode ser superior a 60 dias');
            return false;
          }
          return dias;
        }
      });

      if (dias) {
        // Criar toast de loading          
        const loadingToast = toast.loading('Atualizando validade...');

        try {
          
          if (dias) {
            const response = await fetch(`${baseUrlProposta}/api/sap/atualizarValidade/${docEntry}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                dias,
              })
            });
        
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.details || 'Erro ao atualizar validade');
            }
        
            const data = await response.json();
            
            // Remove loading toast
            toast.dismiss(loadingToast);
            
            // Show success message only after confirmed success
            toast.success(`Validade da cotação ${docNum} atualizada com sucesso`);
            
            // Return data if needed
            return data;
          }
        } catch (error: any) {
          // Remove loading toast
          toast.dismiss(loadingToast);
          
          // Show error message
          toast.error(`Erro ao atualizar validade: ${error.message}`);
          
          // Re-throw error if needed
          throw error;
        }
      } else {
        //toggleActionButtons(docEntry, false);
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  }
  async function encerrarCotacaoSAP(docEntry: string) {
    try {

        let motivos = null;
        const response = await fetch(`${baseUrlProposta}/api/sap/getMotivos`)
            .then((data) => {
                const response = data.json();
                return response;
            })
            .catch((err: any) => {
                throw new Error('Erro ao buscar motivos');
            });
          motivos = response;


            console.log(motivos);
        const motivosOrdenados = motivos!
            .filter((motivo: any) => motivo.FldValue !== "0")
            .sort((a: any, b: any) => parseInt(a.FldValue) - parseInt(b.FldValue));

        const { value: formValues } = await Swal.fire({
            title: 'Fechar Cotação',
            html: `
            <style>
            .form-encerra {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  color: #2c3e50;
  background-color: #f8fafc;
  border: 2px solid rgba(79, 146, 145, 0.2);
  border-radius: 6px;
  transition: all 0.2s ease;
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%234f9291' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}

.form-encerra:hover {
  border-color: rgba(79, 146, 145, 0.4);
  background-color: #ffffff;
}

.form-encerra:focus {
  border-color: #4f9291;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(79, 146, 145, 0.1);
}

.form-encerra option {
  padding: 8px;
  background-color: #ffffff;
}

.form-encerra option:disabled {
  color: #94a3b8;
  border-bottom: 1px solid #e2e8f0;
}

.form-encerra option[value="divider"] {
  height: 1px;
  background-color: #e2e8f0;
  border: none;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

.form-group {
  margin-bottom: 16px;
}
            </style>
          <div class="form-group mb-3">
            <label for="motivoEncerramento" class="form-label">Selecione o motivo do encerramento:</label>
            <select class="form-encerra" id="motivoEncerramento">
              <option value="" selected disabled>Selecione um motivo...</option>
              ${motivosOrdenados.map((motivo: any) =>
                `<option value="${motivo.FldValue}">${motivo.Descr}</option>`
            ).join('')}
              <option value="divider" disabled>─────────────────────────────────────</option>
              <option value="cancelar">Cancelar cotação no SAP</option>
            </select>
          </div>
        `,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Confirmar',
            confirmButtonColor: '#4f9291',
            cancelButtonColor: '#d33',
            preConfirm: () => {
                const motivo = (document.getElementById('motivoEncerramento') as HTMLSelectElement).value;

                if (!motivo) {
                    Swal.showValidationMessage('Por favor, selecione um motivo');
                    return false;
                }

                // Se for cancelamento, não enviamos motivo
                if (motivo === 'cancelar') {
                    return { motivo: null, cancelar: true };
                }

                return { motivo, cancelar: false };
            }
        });

        if (formValues) {
            if (formValues.cancelar) {
                const { isConfirmed } = await Swal.fire({
                    title: 'Confirmar Cancelamento',
                    text: 'Tem certeza que deseja CANCELAR esta cotação? Esta ação não pode ser desfeita.',
                    icon: 'warning',
                    showCancelButton: true,
                    cancelButtonText: 'Não',
                    confirmButtonText: 'Sim',
                    confirmButtonColor: '#4f9291',
                    cancelButtonColor: '#d33'
                });

                if (!isConfirmed) return;
            }

            // Criar toast de loading
            const loadingToast = toast.loading(`${formValues.cancelar ? 'Cancelando' : 'Fechando'} cotação...`);
            try {            
              const response = await fetch(`${baseUrlProposta}/api/sap/encerrarCotacao/${docEntry}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  motivo: formValues.motivo,
                  cancelar: formValues.cancelar,
                })
              });
            
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Erro ao encerrar cotação');
              }
            
              const data = await response.json();
            
              // Remove loading toast
              toast.dismiss(loadingToast);
              
              // Show success message
              toast.success(`Cotação ${formValues.cancelar ? 'cancelada' : 'fechada'} com sucesso`);
            
              return data;
            
            } catch (error: any) {
              // Remove loading toast
              toast.dismiss(loadingToast);
              
              // Show error message
              toast.error(`Erro ao ${formValues.cancelar ? 'cancelar' : 'fechar'} cotação: ${error.message}`);
              
              throw error;
            } finally {
                //toggleActionButtons(docEntry, false);
            }
        } else {
            //toggleActionButtons(docEntry, false);
        }
    } catch (error) {
        console.error('Erro:', error);
        //toggleActionButtons(docEntry, false);
    }

  }

  //Funcoes compartilhar cotacao
  async function getShareLink(docEntry: string): Promise<string> {
    try {
      const quotationDetails = await fetch(`${baseUrlProposta}/api/sap/getQuotationDetails/${docEntry}`);
      const quotationDetailsData = await quotationDetails.json();

      const cardCode = quotationDetailsData[0].CardCode;
      const docNum = quotationDetailsData[0].DocNum;

      const shareLink = `https://meuspedidos.copapel.com.br/cotacao/${cardCode}/${docNum}`;
      return shareLink;
    } catch (error) {
      console.error('Erro ao gerar link de compartilhamento:', error);
      return "";
    }
  }
  async function compartilharCotacao(DocEntry: string) {
    const docEntry = DocEntry;
    const shareLink = await getShareLink(docEntry);

    const copiarLink = async () => {
      try {
        const shareLink = document.getElementById("shareLink")! as HTMLInputElement;
        await navigator.clipboard.writeText(shareLink.value);
        toast.success("Link copiado para a área de transferência");
      } catch (error) {
        console.error('Erro ao copiar link:', error);
        toast.error("Erro ao copiar link");
      }
    };

    const getCotacaoPDF = async (docEntry: string) => {
      try {
        Swal.fire({
          icon: "info",
          title: "Gerando PDF",
          html: `
                    <div class="text-center">
                      <div class="spinner-border text-primary mb-3" role="status">
                        <span class="visually-hidden">Carregando...</span>
                      </div>
                      <p class="mb-0">Por favor, aguarde enquanto o PDF é gerado...</p>
                    </div>
                  `,
          allowOutsideClick: false,
          showConfirmButton: false,
        });

        const response = await fetch(`${baseUrlProposta}/api/sap/getPDF/${docEntry}`);

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');

        link.href = url;
        link.download = `Proposta_${docEntry}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        Swal.close();

        toast.success("PDF gerado com sucesso");

        return;
      } catch (error) {
        console.error('Erro ao gerar PDF:', error);

        Swal.close();

        Swal.fire({
          icon: "error",
          title: "Erro ao gerar PDF",
          text: "Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.",
          confirmButtonColor: "#4f9291",
        });
      }
    };

    const getPropostaPDF = async (docEntry: string) => {
      try {
        const loadingToast = toast.loading('Gerando PDF...');

        const response = await fetch(`${baseUrlProposta}/api/pdf/getQuotationDocument/proposta/${docEntry}`);
        const pdfBuffer = await response.arrayBuffer();
        const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        toast.dismiss(loadingToast);

        // Tenta abrir em nova janela primeiro
        const newWindow = window.open(pdfUrl, '_blank');

        // Se o popup foi bloqueado
        if (newWindow === null) {
          const { isConfirmed } = await Swal.fire({
            icon: 'warning',
            title: 'Popup Bloqueado',
            html: `
                    <div class="text-start">
                      <p>Não foi possível abrir o PDF em uma nova janela porque os popups estão bloqueados.</p>
                      <hr>
                      <p><strong>Você tem duas opções:</strong></p>
                      <ol>
                        <li>Permitir popups para este site:
                          <ul>
                            <li>Procure o ícone de bloqueio de popup na barra de endereço</li>
                            <li>Clique nele e selecione "Sempre permitir popups de [site]"</li>
                            <li>Depois, tente abrir o PDF novamente</li>
                          </ul>
                        </li>
                        <li>Baixar o PDF diretamente clicando em "Baixar PDF"</li>
                      </ol>
                    </div>
                  `,
            showCancelButton: true,
            confirmButtonText: 'Baixar PDF',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#4f9291',
            reverseButtons: true
          });

          if (isConfirmed) {
            // Cria um link temporário para download
            const downloadLink = document.createElement('a');
            downloadLink.href = pdfUrl;
            downloadLink.download = `proposta_${docEntry}.pdf`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            toast.success('Download do PDF iniciado');
          }
        }

        // Limpa a URL do objeto após um tempo
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);

      } catch (error: any) {
        console.error("Erro ao visualizar PDF:", error);
        Swal.fire({
          icon: "error",
          title: "Erro ao gerar PDF",
          html: `
                <div class="text-start">
                  <p>Ocorreu um erro ao gerar o PDF:</p>
                  <div class="alert alert-danger">
                    <i class="fas fa-exclamation-circle me-2"></i>
                    <strong>${error.message}</strong>
                  </div>
                  <p class="mt-3 mb-2">Sugestões:</p>
                  <ul class="list-unstyled">
                    <li class="mb-2">
                      <i class="fas fa-check-circle text-success me-2"></i>
                      Verifique sua conexão com a internet
                    </li>
                    <li class="mb-2">
                      <i class="fas fa-check-circle text-success me-2"></i>
                      Tente recarregar a página
                    </li>
                    <br>
                    <li>
                      <i class="fas fa-info-circle text-primary me-2"></i>
                      Se o problema persistir, entre em contato com o suporte técnico
                    </li>
                  </ul>
                </div>
              `,
          confirmButtonColor: "#4f9291"
        });
      }

    };



    try {
      const modalContent = `
            <div class="modal-body p-4">
              <div class="share-container">
                <div class="share-grid">
                  <!-- Card Cotação -->
                  <div class="share-card">
                    <div class="card-header">
                      <i class="fas fa-file-alt text-primary"></i>
                      <span>Cotação</span>
                    </div>
                    <div class="preview-mini">
                      <div class="preview-content">
                        <div class="preview-line"></div>
                        <div class="preview-line"></div>
                        <div class="preview-line"></div>
                        <div class="preview-line"></div>
                        <div class="preview-line"></div>
                        <div class="preview-line"></div>
                        <div class="preview-line"></div>
                        <div class="preview-line"></div>
                        <div class="preview-line"></div>
                      </div>
                    </div>
                    <div class="card-actions">
                      <button class="btn-action btn-cotacao-pdf download" onclick="getCotacaoPDF('${docEntry}')">
                        <i class="fas fa-download"></i>
                      </button>
                    </div>
                  </div>
      
                  <!-- Card Proposta -->
                  <div class="share-card">
                    <div class="card-header">
                      <i class="fas fa-file-invoice text-success"></i>
                      <span>Proposta</span>
                    </div>
                    <div class="preview-mini">
                      <div class="preview-content">
                        <div class="preview-line"></div>
                        <div class="preview-line"></div>
                        <div class="preview-square"></div>
                        <div class="preview-line"></div>
                        <div class="preview-line"></div>
                      </div>
                    </div>
                    <div class="card-actions">
                      <button class="btn-action btn-proposta-pdf download" onclick="getPropostaPDF('${docEntry}')">
                          <i class="fas fa-download"></i>
                      </button>
                    </div>
                  </div>
                </div>
      
                <!-- Link Section -->
                <div class="link-section mt-3">
                    
                        <input 
                        type="text" 
                        class="input-copiar" 
                        id="shareLink" 
                        readonly 
                        value="${shareLink}"
                        />
                        <button class="custom-copy-btn btn-copy" >
                          <i class="fa-solid fa-copy"></i>
                        </button>
                    
                </div>
              </div>
            </div>
          `;

      const styles = `

            <style>
.custom-copy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  min-width: 40px;
  background-color: #4f9291;
  color: white;
  border: 2px solid transparent;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  outline: none;
}

.custom-copy-btn:hover {
  background-color: #3d7473;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  border-color: #2c5554;
}

.custom-copy-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(79, 146, 145, 0.3);
  border-color: #4f9291;
}

.custom-copy-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  background-color: #2c5554;
}

.custom-copy-btn i {
  font-size: 16px;
}
.input-copiar {
  flex: 1;
  padding: 10px 12px;
  font-size: 14px;
  color: #2c3e50;
  background-color: #f8fafc;
  border: 2px solid rgba(79, 146, 145, 0.2);
  border-radius: 6px;
  transition: all 0.2s ease;
  width: 90%;
  outline: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

.input-copiar:hover {
  border-color: rgba(79, 146, 145, 0.4);
  background-color: #ffffff;
}

.input-copiar:focus {
  border-color: #4f9291;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(79, 146, 145, 0.1),
              inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

.input-copiar:read-only {
  cursor: pointer;
  user-select: all;
}

  .linkSection: {
    marginTop: '1rem'
  },
  .inputGroup: {
    display: 'flex',
    width: '100%',
    gap: '4px'
  },
  .input: {
    flex: 1,
    padding: '6px 12px',
    fontSize: '14px',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    backgroundColor: '#fff'
  },
  .copyButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px 12px',
    fontSize: '14px',
    color: '#0d6efd',
    backgroundColor: 'transparent',
    border: '1px solid #0d6efd',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
            .share-container {
                max-width: 500px;
                margin: 0 auto;
              }
      
              .share-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-bottom: 15px;
              }
      
              .share-card {
                background: #fff;
                border-radius: 8px;
                padding: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                transition: all 0.2s;
                display: flex;
                flex-direction: column;
                gap: 10px;
              }
      
              .share-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              }
      
              .card-header {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 0.9rem;
                font-weight: 500;
              }
      
              .preview-mini {
                height: 60px;
                background: #f8f9fa;
                border-radius: 4px;
                overflow: hidden;
                position: relative;
              }
      
              .preview-content {
                padding: 8px;
                animation: slideUp 8s linear infinite;
              }
      
              .preview-line {
                height: 6px;
                border-radius: 3px;
                margin-bottom: 6px;
                animation: pulse 2s infinite;
              }
      
              .preview-square {
                width: 100%;
                height: 40px;
                border-radius: 3px;
                margin-bottom: 6px;
                margin-top: 6px;
                background: #d1e7dd;
                animation: pulse 2s infinite;
              }
      
              .share-card:first-child .preview-line {
                background: #cfe2ff;
              }
      
              .share-card:last-child .preview-line {
                background: #d1e7dd;
              }
      
              .preview-line:nth-child(2) { width: 75%; }
              .preview-line:nth-child(3) { width: 50%; }
              .preview-line:nth-child(4) { width: 80%; }
              .preview-line:nth-child(5) { width: 60%; }
              .preview-line:nth-child(6) { width: 90%; }
              .preview-line:nth-child(7) { width: 70%; }
              .preview-line:nth-child(8) { width: 55%; }
              .preview-line:nth-child(9) { width: 40%; }
      
              .card-actions {
                display: flex;
                gap: 8px;
              }
      
              .btn-action {
                flex: 1;
                padding: 6px;
                border: none;
                border-radius: 4px;
                background: #f8f9fa;
                color: #6c757d;
                transition: all 0.2s;
              }
      
              .btn-action:hover {
                background: #e9ecef;
                color: #000;
                transform: translateY(-1px);
              }
      
              .btn-action.download:hover {
                background: #cfe2ff;
                color: #0d6efd;
              }
      
              .btn-action.share:hover {
                background: #d1e7dd;
                color: #198754;
              }
      
              .link-section {
                width: 100%;
                display: flex;
                justify-content: between;
                gap: 6px;
                background: #f8f9fa;
                border-radius: 6px;
                padding: 10px;
              }
      
              .link-section .input-group {
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
              }
      
              @keyframes slideUp {
                0% { transform: translateY(0); }
                45% { transform: translateY(-50%); }
                55% { transform: translateY(-50%); }
                100% { transform: translateY(0); }
              }
      
              @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.6; }
                100% { opacity: 1; }
              }
            </style>
          `;

      await Swal.fire({
        title: '<i class="fas fa-share-alt me-2"></i>Compartilhar',
        html: styles + modalContent,
        showConfirmButton: false,
        showCloseButton: true,
        width: '550px',
        didOpen: () => {
          // Aqui você adiciona os event listeners aos botões
          document.querySelector('.btn-copy')?.addEventListener('click', copiarLink);
          document.querySelector('.btn-cotacao-pdf')?.addEventListener('click', () => getCotacaoPDF(DocEntry));
          document.querySelector('.btn-proposta-pdf')?.addEventListener('click', () => getPropostaPDF(DocEntry));
        },
        customClass: {
          container: 'share-modal-container'
        }
      });

    } catch (error) {
      console.error("Erro ao compartilhar cotação:", error);
      toast.error("Erro ao compartilhar cotação");
    }
  }
  // - fim compartilhar



  const handleActionClick = (action: string, docEntry: string, docNum: string) => {
    console.log(action)
    switch (action) {
      case 'visualizarPDF':
        visualizarPDF(docEntry);
        break;
      case 'duplicarProposta':
        duplicarProposta(docEntry);
        break;
      case 'visualizarDadosSAP':
        visualizarDadosSAP(docEntry);
        break;
      case 'compartilharCotacao':
        compartilharCotacao(docEntry);
        break;
      case 'atualizarValidade':
        atualizarValidade(docEntry, docNum);
        break;
      case 'encerrarCotacaoSAP':
        encerrarCotacaoSAP(docEntry)
        break;
      default:
        toast.error("Ação ainda não implementada!")
    }
  };

  const btColor = index % 2 == 0 ? "white" : "gray-100";
  return (
    <div key={index} className={`flex w-full gap-2  box-border bg-${btColor}  rounded-md customBorder transition-all duration-500 `} >
      <p className="w-1/6 ml-4 flex items-center gap-4 m-0 p-0" >  {cotacao.DocNum}  </p>
      <p className="w-1/6 flex items-center"> {BRL.format(cotacao.DocTotal)} </p>
      <p className="w-1/6 flex items-center">{new Date(cotacao.DocDate).toLocaleDateString('pt-BR')} </p>
      <p className="w-2/6 flex items-center">{new Date(cotacao.DocDueDate).toLocaleDateString('pt-BR')}</p>
      <p className="w-1/6 flex items-center">{getStatus(cotacao.DOCSTATUS)}</p>
      {<p className="w-1/6 flex items-center"><ActionButtons status={getStatus(cotacao.DOCSTATUS)} docNum={cotacao.DocNum} docEntry={cotacao.DocEntry} onActionClick={handleActionClick} /> </p>}
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, rounded: 3 }}>
          <Typography >
            <div dangerouslySetInnerHTML={{ __html: modalContent }} />
          </Typography>
        </Box>
      </Modal>

    </div>
  )


}