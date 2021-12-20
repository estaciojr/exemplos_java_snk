package br.com.dalla.glazau.entrada.encomenda;

import br.com.sankhya.jape.EntityFacade;
import br.com.sankhya.jape.PersistenceException;
import br.com.sankhya.jape.bmp.PersistentLocalEntity;
import br.com.sankhya.jape.dao.JdbcWrapper;
import br.com.sankhya.jape.sql.NativeSql;
import br.com.sankhya.jape.util.FinderWrapper;
import br.com.sankhya.jape.vo.DynamicVO;
import br.com.sankhya.jape.vo.EntityVO;
import br.com.sankhya.jape.vo.PrePersistEntityState;
import br.com.sankhya.modelcore.comercial.ContextoRegra;
import br.com.sankhya.modelcore.comercial.Regra;
import br.com.sankhya.modelcore.dwfdata.vo.ItemNotaVO;
import br.com.sankhya.modelcore.util.EntityFacadeFactory;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.util.Collection;
import java.util.Iterator;

public class ConfirmacaoEntrada implements Regra {

    @Override
    public void beforeInsert(ContextoRegra contexto) throws Exception {

    }

    @Override
    public void beforeUpdate(ContextoRegra contexto) throws Exception {

    }

    @Override
    public void beforeDelete(ContextoRegra contexto) throws Exception {

    }

    @Override
    public void afterInsert(ContextoRegra contexto) throws Exception {

    }

    @Override
    public void afterUpdate(ContextoRegra contexto) throws Exception {
        PrePersistEntityState preES = contexto.getPrePersistEntityState();
        if (preES.getDao().getEntityName() != null) {
            if (preES.getDao().getEntityName().equals("CabecalhoNota"))
            {
                DynamicVO newCabVO = preES.getNewVO();
                DynamicVO oldCabVO = preES.getOldVO();
                if ((!oldCabVO.asString("STATUSNOTA").equals("L")) &&
                        (newCabVO.asString("STATUSNOTA").equals("L")))
                {
                    alteraConfirmacao(contexto);

                }
            }
        }
    }

    @Override
    public void afterDelete(ContextoRegra contexto) throws Exception {

    }
    private void alteraConfirmacao (ContextoRegra contexto) throws Exception {
        PrePersistEntityState preES = contexto.getPrePersistEntityState();
        EntityFacade dwfFacade = EntityFacadeFactory.getDWFFacade();
        try {
            if ((preES.getDao() != null) &&
                    (preES.getDao().getEntityName() != null) &&
                    (preES.getDao().getEntityName().equals("CabecalhoNota"))) {
                DynamicVO cabVO = preES.getNewVO();
                BigDecimal nuNota = cabVO.asBigDecimal("NUNOTA");
                String tipMov = cabVO.asString("TIPMOV");
                BigDecimal codtipoper = cabVO.asBigDecimal("CODTIPOPER");
                BigDecimal localAlteracao = BigDecimal.valueOf(102);
                BigDecimal localPedidoSeparacao = BigDecimal.valueOf(104);
                BigDecimal localEntrada = BigDecimal.valueOf(105);
                BigDecimal topCompra = BigDecimal.valueOf(1430);

                if (!tipMov.isEmpty() && tipMov.equals("C") && codtipoper.compareTo(topCompra) == 0) {
                    System.out.println("############### ENTROU NO IF #################");
                    Collection<?> iteproduto = EntityFacadeFactory.getDWFFacade().findByDynamicFinder(new FinderWrapper("ItemNota", "this.NUNOTA = ? and this.SEQUENCIA>0 ", new Object[]{nuNota}));
                    if (!iteproduto.isEmpty())
                        for (Iterator<?> itepro = iteproduto.iterator(); itepro.hasNext(); ) {
                            PersistentLocalEntity iteproEntity = (PersistentLocalEntity) itepro.next();
                            ItemNotaVO iteproVO = (ItemNotaVO) ((DynamicVO) iteproEntity.getValueObject()).wrapInterface(ItemNotaVO.class);
                            BigDecimal qtdnegCompra = (BigDecimal) iteproVO.getProperty("QTDNEG");

                            if (iteproVO.getCODLOCALORIG().equals(localEntrada)) {
                                BigDecimal codprod = (BigDecimal) iteproVO.getProperty("CODPROD");
                                BigDecimal contador = qtdnegCompra;
                                JdbcWrapper jdbc = dwfFacade.getJdbcWrapper();
                                NativeSql sql = new NativeSql(jdbc);
                                sql.setReuseStatements(true);
                                sql.appendSql(" SELECT ");
                                sql.appendSql(" CAB.AD_NUNOTAORIG,CAB.NUNOTA,CAB.TIPMOV,CAB.CODTIPOPER,CAB.DTNEG,ITE.CODPROD,ITE.CODLOCALORIG,ITE.QTDNEG,ITE.SEQUENCIA");
                                sql.appendSql(" FROM TGFCAB CAB ");
                                sql.appendSql(" INNER JOIN TGFITE ITE ON ITE.NUNOTA = CAB.NUNOTA ");
                                sql.appendSql(" WHERE ITE.CODLOCALORIG = 104 AND CAB.CODTIPOPER  = 1063 AND ITE.CODPROD = :CODPROD ");
                                sql.appendSql(" ORDER BY CAB.DTNEG ASC");
                                sql.setNamedParameter("CODPROD", codprod);
                                ResultSet rset = sql.executeQuery();
                                while (rset.next()) {
                                    BigDecimal nunota = rset.getBigDecimal("NUNOTA");
                                    Collection<?> iteprodutoped = EntityFacadeFactory.getDWFFacade().findByDynamicFinder(new FinderWrapper("ItemNota", "this.NUNOTA = ? and this.SEQUENCIA>0 ", new Object[]{nunota}));
                                    if (!iteprodutoped.isEmpty())
                                        for (Iterator<?> iteproped = iteprodutoped.iterator(); iteproped.hasNext(); ) {
                                            PersistentLocalEntity itepropedEntity = (PersistentLocalEntity) iteproped.next();
                                            ItemNotaVO itepropedVO = (ItemNotaVO) ((DynamicVO) itepropedEntity.getValueObject()).wrapInterface(ItemNotaVO.class);
                                            if (itepropedVO.getCODLOCALORIG().compareTo(localPedidoSeparacao) == 0 && itepropedVO.getCODPROD().compareTo(codprod) == 0 && (contador.compareTo(itepropedVO.getQTDNEG()) == 1 || contador.compareTo(itepropedVO.getQTDNEG()) == 0)) {
                                                if (contador.compareTo(itepropedVO.getQTDNEG()) == 1) {
                                                    itepropedVO.setProperty("CODLOCALORIG", localAlteracao);
                                                    itepropedEntity.setValueObject((EntityVO) itepropedVO);
                                                    contador = contador.subtract(itepropedVO.getQTDNEG());
                                                    continue;
                                                }
                                                if (contador.compareTo(itepropedVO.getQTDNEG()) == 0) {
                                                    itepropedVO.setProperty("CODLOCALORIG", localAlteracao);
                                                    itepropedEntity.setValueObject((EntityVO) itepropedVO);
                                                    contador = contador.subtract(itepropedVO.getQTDNEG());
                                                }
                                            }
                                        }
                                    iteproVO.setProperty("CODLOCALORIG", localAlteracao);
                                    iteproEntity.setValueObject((EntityVO) iteproVO);
                                }
                            }
                        }
                }
            }
        }
   catch (Exception e){
       System.out.println("$$$$$$$$$$$$$$$$ tratar erro $$$$$$$$$$$$$$$$$$$$");
       System.out.println("$$$$$$$$$$$$$$$$ tratar erro $$$$$$$$$$$$$$$$$$$$");
       System.out.println("$$$$$$$$$$$$$$$$ tratar erro $$$$$$$$$$$$$$$$$$$$");
       System.out.println("$$$$$$$$$$$$$$$$ tratar erro $$$$$$$$$$$$$$$$$$$$");
       System.out.println("$$$$$$$$$$$$$$$$ tratar erro $$$$$$$$$$$$$$$$$$$$");
       System.out.println("$$$$$$$$$$$$$$$$ tratar erro $$$$$$$$$$$$$$$$$$$$");
       System.out.println("$$$$$$$$$$$$$$$$ tratar erro $$$$$$$$$$$$$$$$$$$$" + e);
     }
     }


    private void exibirErro(String mensagem) throws Exception {
        throw new PersistenceException("<p align=\"center\"><img src=\"https://dallabernardina.vteximg.com.br/arquivos/logo_header.png\" height=\"100\" width=\"300\"></img></p><br/><br/><br/><br/><br/><br/>\n\n\n\n<font size=\"15\" color=\"#BF2C2C\"><b> " + mensagem + "</b></font>\n\n\n");
    }
}
