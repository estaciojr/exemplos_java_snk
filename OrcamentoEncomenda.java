package br.com.dalla.glazau.entrada.encomenda;

import br.com.sankhya.extensions.eventoprogramavel.EventoProgramavelJava;
import br.com.sankhya.jape.PersistenceException;
import br.com.sankhya.jape.bmp.PersistentLocalEntity;
import br.com.sankhya.jape.event.PersistenceEvent;
import br.com.sankhya.jape.event.TransactionContext;
import br.com.sankhya.jape.util.FinderWrapper;
import br.com.sankhya.jape.vo.DynamicVO;
import br.com.sankhya.jape.vo.EntityVO;
import br.com.sankhya.modelcore.dwfdata.vo.ItemNotaVO;
import br.com.sankhya.modelcore.util.EntityFacadeFactory;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.Iterator;


public class OrcamentoEncomenda implements EventoProgramavelJava {



    @Override
    public void beforeInsert(PersistenceEvent persistenceEvent) throws Exception {

    }

    @Override
    public void beforeUpdate(PersistenceEvent persistenceEvent) throws Exception {
        OrcamentoEncomenda(persistenceEvent);
    }

    @Override
    public void beforeDelete(PersistenceEvent persistenceEvent) throws Exception {

    }

    @Override
    public void afterInsert(PersistenceEvent persistenceEvent) throws Exception {

    }

    @Override
    public void afterUpdate(PersistenceEvent persistenceEvent) throws Exception {

    }

    @Override
    public void afterDelete(PersistenceEvent persistenceEvent) throws Exception {

    }

    @Override
    public void beforeCommit(TransactionContext transactionContext) throws Exception {

    }
    private void OrcamentoEncomenda(PersistenceEvent event) throws Exception {
        BigDecimal orcamentoCompra = BigDecimal.valueOf(1304);
        BigDecimal pedCompraEncomenda = BigDecimal.valueOf(1324);
        BigDecimal localEntrada = BigDecimal.valueOf(105);

            DynamicVO cabVO = (DynamicVO)event.getVo();
            BigDecimal nuNota = cabVO.asBigDecimal("NUNOTA");
            BigDecimal codtipoper = cabVO.asBigDecimal("CODTIPOPER");
            if(codtipoper.compareTo(orcamentoCompra)==0 || codtipoper.compareTo(pedCompraEncomenda)==0) {
                Collection<?> iteCompraEncomenda = EntityFacadeFactory.getDWFFacade().findByDynamicFinder(new FinderWrapper("ItemNota", "this.NUNOTA = ? and this.SEQUENCIA>0 ", new Object[]{nuNota}));
                for (Iterator<?> itepro = iteCompraEncomenda.iterator(); itepro.hasNext(); ) {
                    if (!iteCompraEncomenda.isEmpty()) {
                        PersistentLocalEntity iteEncomendaEntity = (PersistentLocalEntity) itepro.next();
                        ItemNotaVO iteproEncomendaVO = (ItemNotaVO) ((DynamicVO) iteEncomendaEntity.getValueObject()).wrapInterface(ItemNotaVO.class);
                        if (iteproEncomendaVO.getCODLOCALORIG()!=localEntrada) {
                            iteproEncomendaVO.setProperty("CODLOCALORIG", localEntrada);
                            iteEncomendaEntity.setValueObject((EntityVO) iteproEncomendaVO);
                        }
                    }
                }
            }

    }
    private void exibirErro(String mensagem) throws Exception {
        throw new PersistenceException("<p align=\"center\"><img src=\"https://dallabernardina.vteximg.com.br/arquivos/logo_header.png\" height=\"100\" width=\"300\"></img></p><br/><br/><br/><br/><br/><br/>\n\n\n\n<font size=\"15\" color=\"#BF2C2C\"><b> " + mensagem + "</b></font>\n\n\n");
    }
}